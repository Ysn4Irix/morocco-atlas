package com.moroccoapi.atlas.ui

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.moroccoapi.atlas.ui.screens.*

enum class BottomTab { REGIONS, SETTINGS }

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AtlasApp(viewModel: AtlasViewModel) {
    val language by viewModel.language.collectAsState()
    val regions by viewModel.regions.collectAsState()
    val provinces by viewModel.provincesForSelectedRegion.collectAsState()
    val communesForExpandedProvince by viewModel.communesForExpandedProvince.collectAsState()
    val expandedProvinceCode by viewModel.expandedProvinceCode.collectAsState()
    val highlightedCommuneCode by viewModel.highlightedCommuneCode.collectAsState()
    val searchResults by viewModel.searchResults.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()
    val isSearchActive by viewModel.isSearchActive.collectAsState()
    val selectedRegion by viewModel.selectedRegion.collectAsState()
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
                if (selectedRegion == null) {
                    if (isSearchActive) {
                        TopAppBar(
                            title = {
                                OutlinedTextField(
                                    value = searchQuery,
                                    onValueChange = { viewModel.setSearchQuery(it) },
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(end = 8.dp),
                                    placeholder = {
                                        Text(
                                            text = when (language) {
                                                AppLanguage.AR -> "ابحث عن جهة، عمالة، أو جماعة..."
                                                AppLanguage.EN -> "Search region, province or commune..."
                                                AppLanguage.FR -> "Rechercher région, province ou commune..."
                                            },
                                            fontSize = 13.sp
                                        )
                                    },
                                    singleLine = true,
                                    trailingIcon = {
                                        if (searchQuery.isNotEmpty()) {
                                            IconButton(onClick = { viewModel.setSearchQuery("") }) {
                                                Icon(Icons.Default.Clear, contentDescription = "Clear")
                                            }
                                        }
                                    },
                                    colors = OutlinedTextFieldDefaults.colors(
                                        focusedBorderColor = MaterialTheme.colorScheme.primary,
                                        unfocusedBorderColor = MaterialTheme.colorScheme.outlineVariant
                                    ),
                                    shape = RoundedCornerShape(12.dp)
                                )
                            },
                            navigationIcon = {
                                IconButton(onClick = { viewModel.setSearchActive(false) }) {
                                    Icon(
                                        imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                                        contentDescription = "Close search"
                                    )
                                }
                            },
                            colors = TopAppBarDefaults.topAppBarColors(
                                containerColor = MaterialTheme.colorScheme.surface
                            )
                        )
                    } else {
                        TopAppBar(
                            title = {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    Text(
                                        text = when (language) {
                                            AppLanguage.AR -> "دليل المغرب الإداري"
                                            AppLanguage.EN -> "Morocco Atlas"
                                            AppLanguage.FR -> "Atlas du Maroc"
                                        },
                                        fontWeight = FontWeight.ExtraBold,
                                        fontSize = 19.sp
                                    )
                                    Surface(
                                        shape = RoundedCornerShape(6.dp),
                                        color = MaterialTheme.colorScheme.primary.copy(alpha = 0.12f)
                                    ) {
                                        Text(
                                            text = "RGPH 2024",
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                            style = MaterialTheme.typography.labelSmall,
                                            fontWeight = FontWeight.Bold,
                                            color = MaterialTheme.colorScheme.primary
                                        )
                                    }
                                }
                            },
                            actions = {
                                IconButton(onClick = { viewModel.setSearchActive(true) }) {
                                    Icon(
                                        imageVector = Icons.Default.Search,
                                        contentDescription = "Search"
                                    )
                                }
                            },
                            colors = TopAppBarDefaults.topAppBarColors(
                                containerColor = MaterialTheme.colorScheme.surface
                            )
                        )
                    }
                }
            },
            bottomBar = {
                if (selectedRegion == null && !isSearchActive) {
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
                    selectedRegion != null -> {
                        ProvincesScreen(
                            region = selectedRegion!!,
                            provinces = provinces,
                            language = language,
                            expandedProvinceCode = expandedProvinceCode,
                            onToggleProvince = { viewModel.toggleProvince(it) },
                            communesForExpandedProvince = communesForExpandedProvince,
                            highlightedCommuneCode = highlightedCommuneCode,
                            onBack = { viewModel.selectRegion(null) }
                        )
                    }
                    isSearchActive -> {
                        // Instant Universal Search Autocomplete Overlay
                        if (searchQuery.trim().isEmpty()) {
                            Box(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .padding(24.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = when (language) {
                                        AppLanguage.AR -> "اكتب للبحث في 12 جهة، 75 إقليماً وعمالة، و1,503 جماعة"
                                        AppLanguage.EN -> "Type to search 12 regions, 75 provinces, and 1,503 communes"
                                        AppLanguage.FR -> "Tapez pour rechercher 12 régions, 75 provinces et 1 503 communes"
                                    },
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        } else if (searchResults.isEmpty()) {
                            Box(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .padding(24.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = when (language) {
                                        AppLanguage.AR -> "لا توجد نتائج مطابقة لبحثك"
                                        AppLanguage.EN -> "No results matching your query"
                                        AppLanguage.FR -> "Aucun résultat trouvé"
                                    },
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        } else {
                            LazyColumn(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .padding(horizontal = 16.dp, vertical = 8.dp),
                                verticalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                items(searchResults, key = { it.id }) { item ->
                                    val itemName = when (language) {
                                        AppLanguage.AR -> item.nameAr
                                        AppLanguage.EN -> item.nameEn ?: item.nameFr
                                        AppLanguage.FR -> item.nameFr
                                    }

                                    Card(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .clip(RoundedCornerShape(12.dp))
                                            .clickable { viewModel.selectSearchResult(item) },
                                        colors = CardDefaults.cardColors(
                                            containerColor = MaterialTheme.colorScheme.surface
                                        ),
                                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                                    ) {
                                        Row(
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .padding(12.dp),
                                            verticalAlignment = Alignment.CenterVertically,
                                            horizontalArrangement = Arrangement.SpaceBetween
                                        ) {
                                            Row(
                                                verticalAlignment = Alignment.CenterVertically,
                                                horizontalArrangement = Arrangement.spacedBy(10.dp),
                                                modifier = Modifier.weight(1f)
                                            ) {
                                                // Type badge
                                                Surface(
                                                    shape = RoundedCornerShape(6.dp),
                                                    color = when (item.type) {
                                                        "region" -> MaterialTheme.colorScheme.primary.copy(alpha = 0.15f)
                                                        "province" -> MaterialTheme.colorScheme.secondary.copy(alpha = 0.15f)
                                                        else -> MaterialTheme.colorScheme.tertiary.copy(alpha = 0.15f)
                                                    }
                                                ) {
                                                    Text(
                                                        text = when (item.type) {
                                                            "region" -> when (language) {
                                                                AppLanguage.AR -> "جهة"
                                                                AppLanguage.EN -> "REGION"
                                                                AppLanguage.FR -> "RÉGION"
                                                            }
                                                            "province" -> when (language) {
                                                                AppLanguage.AR -> "إقليم/عمالة"
                                                                AppLanguage.EN -> "PROVINCE"
                                                                AppLanguage.FR -> "PROVINCE"
                                                            }
                                                            else -> when (language) {
                                                                AppLanguage.AR -> "جماعة"
                                                                AppLanguage.EN -> "COMMUNE"
                                                                AppLanguage.FR -> "COMMUNE"
                                                            }
                                                        },
                                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 3.dp),
                                                        style = MaterialTheme.typography.labelSmall,
                                                        fontWeight = FontWeight.Bold,
                                                        color = when (item.type) {
                                                            "region" -> MaterialTheme.colorScheme.primary
                                                            "province" -> MaterialTheme.colorScheme.secondary
                                                            else -> MaterialTheme.colorScheme.tertiary
                                                        }
                                                    )
                                                }

                                                Column {
                                                    Text(
                                                        text = itemName,
                                                        style = MaterialTheme.typography.titleSmall,
                                                        fontWeight = FontWeight.SemiBold
                                                    )
                                                    if (language != AppLanguage.AR) {
                                                        Text(
                                                            text = item.nameAr,
                                                            style = MaterialTheme.typography.labelSmall,
                                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                                        )
                                                    }
                                                }
                                            }

                                            Surface(
                                                shape = RoundedCornerShape(6.dp),
                                                color = MaterialTheme.colorScheme.surfaceVariant
                                            ) {
                                                Text(
                                                    text = item.hcpCode,
                                                    style = MaterialTheme.typography.labelSmall,
                                                    fontWeight = FontWeight.Bold,
                                                    fontFamily = FontFamily.Monospace,
                                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                                )
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    currentTab == BottomTab.REGIONS -> {
                        RegionsScreen(
                            regions = regions,
                            language = language,
                            onRegionClick = { viewModel.selectRegion(it) }
                        )
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
