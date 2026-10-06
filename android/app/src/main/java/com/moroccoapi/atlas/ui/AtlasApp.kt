package com.moroccoapi.atlas.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.moroccoapi.atlas.ui.screens.*

enum class BottomTab { REGIONS, SEARCH, SETTINGS }

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AtlasApp(viewModel: AtlasViewModel) {
    val language by viewModel.language.collectAsState()
    val regions by viewModel.regions.collectAsState()
    val provinces by viewModel.provincesForSelectedRegion.collectAsState()
    val communes by viewModel.communesForSelectedProvince.collectAsState()
    val searchResults by viewModel.searchResults.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()
    val selectedRegion by viewModel.selectedRegion.collectAsState()
    val selectedProvince by viewModel.selectedProvince.collectAsState()
    val syncMessage by viewModel.syncMessage.collectAsState()
    val isSyncing by viewModel.isSyncing.collectAsState()

    var currentTab by remember { mutableStateOf(BottomTab.REGIONS) }
    val snackbarHostState = remember { SnackbarHostState() }

    LaunchedEffect(syncMessage) {
        syncMessage?.let {
            snackbarHostState.showSnackbar(it)
            viewModel.dismissSyncMessage()
        }
    }

    val layoutDirection = if (language == AppLanguage.AR) LayoutDirection.Rtl else LayoutDirection.Ltr

    CompositionLocalProvider(LocalLayoutDirection provides layoutDirection) {
        Scaffold(
            snackbarHost = { SnackbarHost(snackbarHostState) },
            topBar = {
                if (selectedRegion == null && selectedProvince == null) {
                    TopAppBar(
                        title = {
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                Text(
                                    text = when (language) {
                                        AppLanguage.AR -> "دليل المغرب الإداري"
                                        AppLanguage.EN -> "Morocco Atlas"
                                        AppLanguage.FR -> "Atlas du Maroc"
                                    },
                                    fontWeight = FontWeight.ExtraBold,
                                    fontSize = 20.sp
                                )
                            }
                        },
                        colors = TopAppBarDefaults.topAppBarColors(
                            containerColor = MaterialTheme.colorScheme.surface
                        )
                    )
                }
            },
            bottomBar = {
                if (selectedRegion == null && selectedProvince == null) {
                    NavigationBar {
                        NavigationBarItem(
                            selected = currentTab == BottomTab.REGIONS,
                            onClick = { currentTab = BottomTab.REGIONS },
                            icon = { Icon(Icons.Default.Map, contentDescription = "Atlas") },
                            label = {
                                Text(
                                    when (language) {
                                        AppLanguage.AR -> "الجهات"
                                        AppLanguage.EN -> "Atlas"
                                        AppLanguage.FR -> "Atlas"
                                    }
                                )
                            }
                        )
                        NavigationBarItem(
                            selected = currentTab == BottomTab.SEARCH,
                            onClick = { currentTab = BottomTab.SEARCH },
                            icon = { Icon(Icons.Default.Search, contentDescription = "Search") },
                            label = {
                                Text(
                                    when (language) {
                                        AppLanguage.AR -> "بحث"
                                        AppLanguage.EN -> "Search"
                                        AppLanguage.FR -> "Recherche"
                                    }
                                )
                            }
                        )
                        NavigationBarItem(
                            selected = currentTab == BottomTab.SETTINGS,
                            onClick = { currentTab = BottomTab.SETTINGS },
                            icon = { Icon(Icons.Default.Settings, contentDescription = "Settings") },
                            label = {
                                Text(
                                    when (language) {
                                        AppLanguage.AR -> "الإعدادات"
                                        AppLanguage.EN -> "Settings"
                                        AppLanguage.FR -> "Paramètres"
                                    }
                                )
                            }
                        )
                    }
                }
            }
        ) { innerPadding ->
            Box(modifier = Modifier.padding(innerPadding)) {
                when {
                    selectedProvince != null -> {
                        CommunesScreen(
                            province = selectedProvince!!,
                            communes = communes,
                            language = language,
                            onBack = { viewModel.selectProvince(null) }
                        )
                    }
                    selectedRegion != null -> {
                        ProvincesScreen(
                            region = selectedRegion!!,
                            provinces = provinces,
                            language = language,
                            onBack = { viewModel.selectRegion(null) },
                            onProvinceClick = { viewModel.selectProvince(it) }
                        )
                    }
                    currentTab == BottomTab.REGIONS -> {
                        RegionsScreen(
                            regions = regions,
                            language = language,
                            onRegionClick = { viewModel.selectRegion(it) }
                        )
                    }
                    currentTab == BottomTab.SEARCH -> {
                        Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
                            OutlinedTextField(
                                value = searchQuery,
                                onValueChange = { viewModel.setSearchQuery(it) },
                                modifier = Modifier.fillMaxWidth(),
                                placeholder = {
                                    Text(
                                        when (language) {
                                            AppLanguage.AR -> "ابحث عن جماعة أو رمز HCP..."
                                            AppLanguage.EN -> "Search commune or HCP code..."
                                            AppLanguage.FR -> "Rechercher une commune..."
                                        }
                                    )
                                },
                                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                                trailingIcon = {
                                    if (searchQuery.isNotEmpty()) {
                                        IconButton(onClick = { viewModel.setSearchQuery("") }) {
                                            Icon(Icons.Default.Clear, contentDescription = "Clear")
                                        }
                                    }
                                },
                                singleLine = true
                            )

                            Spacer(modifier = Modifier.height(12.dp))

                            LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                items(searchResults, key = { it.code }) { commune ->
                                    CommuneCard(
                                        commune = commune,
                                        language = language,
                                        onCopyCode = {}
                                    )
                                }
                            }
                        }
                    }
                    currentTab == BottomTab.SETTINGS -> {
                        SettingsScreen(
                            language = language,
                            onLanguageChange = { viewModel.setLanguage(it) },
                            isSyncing = isSyncing,
                            onCheckForUpdates = { viewModel.checkForUpdates(silent = false) }
                        )
                    }
                }
            }
        }
    }
}
