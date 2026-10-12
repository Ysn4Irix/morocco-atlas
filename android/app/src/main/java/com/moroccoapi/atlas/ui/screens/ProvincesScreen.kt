package com.moroccoapi.atlas.ui.screens

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.widget.Toast
import androidx.compose.animation.animateContentSize
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.moroccoapi.atlas.data.local.CommuneEntity
import com.moroccoapi.atlas.data.local.ProvinceEntity
import com.moroccoapi.atlas.data.local.RegionEntity
import com.moroccoapi.atlas.ui.AppLanguage

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProvincesScreen(
    region: RegionEntity,
    provinces: List<ProvinceEntity>,
    language: AppLanguage,
    expandedProvinceCode: String?,
    onToggleProvince: (String) -> Unit,
    communesForExpandedProvince: List<CommuneEntity>,
    highlightedCommuneCode: String?,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    val regionName = when (language) {
        AppLanguage.AR -> region.name_ar
        AppLanguage.EN -> region.name_en ?: region.name_fr
        AppLanguage.FR -> region.name_fr
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(text = regionName, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                        Text(
                            text = "${provinces.size} " + when (language) {
                                AppLanguage.AR -> "أقاليم وعمالات"
                                AppLanguage.EN -> "provinces & prefectures"
                                AppLanguage.FR -> "provinces et préfectures"
                            },
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(imageVector = Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 16.dp, vertical = 8.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(provinces, key = { it.code }) { province ->
                val isExpanded = expandedProvinceCode == province.code
                ProvinceAccordionCard(
                    province = province,
                    language = language,
                    isExpanded = isExpanded,
                    communes = if (isExpanded) communesForExpandedProvince else emptyList(),
                    highlightedCommuneCode = highlightedCommuneCode,
                    onToggle = { onToggleProvince(province.code) }
                )
            }
        }
    }
}

@Composable
fun ProvinceAccordionCard(
    province: ProvinceEntity,
    language: AppLanguage,
    isExpanded: Boolean,
    communes: List<CommuneEntity>,
    highlightedCommuneCode: String?,
    onToggle: () -> Unit
) {
    val context = LocalContext.current
    var communeFilter by remember(province.code, isExpanded) { mutableStateOf("") }

    val filteredCommunes = remember(communes, communeFilter) {
        if (communeFilter.trim().isEmpty()) {
            communes
        } else {
            val q = communeFilter.trim().lowercase()
            communes.filter { c ->
                c.code.lowercase().contains(q) ||
                c.hcp_code.contains(q) ||
                c.name_ar.lowercase().contains(q) ||
                c.name_fr.lowercase().contains(q) ||
                (c.name_en?.lowercase()?.contains(q) == true)
            }
        }
    }

    val displayName = when (language) {
        AppLanguage.AR -> province.name_ar
        AppLanguage.EN -> province.name_en ?: province.name_fr
        AppLanguage.FR -> province.name_fr
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(14.dp))
            .animateContentSize(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(modifier = Modifier.fillMaxWidth()) {
            // Province Header Row
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable(onClick = onToggle)
                    .padding(14.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    modifier = Modifier.weight(1f)
                ) {
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = if (province.administrative_type == "prefecture")
                            MaterialTheme.colorScheme.secondary.copy(alpha = 0.15f)
                        else
                            MaterialTheme.colorScheme.primary.copy(alpha = 0.15f),
                        modifier = Modifier.padding(2.dp)
                    ) {
                        Text(
                            text = province.administrative_type.uppercase(),
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = if (province.administrative_type == "prefecture")
                                MaterialTheme.colorScheme.secondary
                            else
                                MaterialTheme.colorScheme.primary
                        )
                    }

                    Column {
                        Text(
                            text = displayName,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.SemiBold
                        )
                        Text(
                            text = "HCP: ${province.hcp_code}",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }

                Icon(
                    imageVector = if (isExpanded) Icons.Default.KeyboardArrowUp else Icons.Default.KeyboardArrowDown,
                    contentDescription = if (isExpanded) "Collapse" else "Expand",
                    tint = MaterialTheme.colorScheme.primary
                )
            }

            // Integrated Communes Section (Expanded Accordion Body)
            if (isExpanded) {
                HorizontalDivider(
                    color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.5f)
                )

                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.35f))
                        .padding(14.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    // Communes header and count
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = when (language) {
                                AppLanguage.AR -> "الجماعات الترابية"
                                AppLanguage.EN -> "Communes"
                                AppLanguage.FR -> "Communes"
                            },
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Text(
                            text = "${communes.size} " + when (language) {
                                AppLanguage.AR -> "جماعة"
                                AppLanguage.EN -> "communes"
                                AppLanguage.FR -> "communes"
                            },
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }

                    // In-province commune search filter
                    OutlinedTextField(
                        value = communeFilter,
                        onValueChange = { communeFilter = it },
                        modifier = Modifier.fillMaxWidth(),
                        placeholder = {
                            Text(
                                text = when (language) {
                                    AppLanguage.AR -> "تصفية الجماعات داخل الإقليم..."
                                    AppLanguage.EN -> "Filter communes in province..."
                                    AppLanguage.FR -> "Filtrer les communes..."
                                },
                                fontSize = 12.sp
                            )
                        },
                        leadingIcon = {
                            Icon(
                                Icons.Default.Search,
                                contentDescription = null,
                                modifier = Modifier.size(16.dp)
                            )
                        },
                        trailingIcon = {
                            if (communeFilter.isNotEmpty()) {
                                IconButton(
                                    onClick = { communeFilter = "" },
                                    modifier = Modifier.size(20.dp)
                                ) {
                                    Icon(
                                        Icons.Default.Clear,
                                        contentDescription = "Clear",
                                        modifier = Modifier.size(16.dp)
                                    )
                                }
                            }
                        },
                        singleLine = true,
                        textStyle = MaterialTheme.typography.bodySmall,
                        shape = RoundedCornerShape(10.dp)
                    )

                    // Communes list
                    if (filteredCommunes.isEmpty()) {
                        Text(
                            text = when (language) {
                                AppLanguage.AR -> "لا توجد جماعات مطابقة"
                                AppLanguage.EN -> "No communes match"
                                AppLanguage.FR -> "Aucune commune correspondante"
                            },
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.padding(vertical = 8.dp)
                        )
                    } else {
                        Column(
                            verticalArrangement = Arrangement.spacedBy(6.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            filteredCommunes.forEach { commune ->
                                val isHighlighted = highlightedCommuneCode == commune.code
                                val communeName = when (language) {
                                    AppLanguage.AR -> commune.name_ar
                                    AppLanguage.EN -> commune.name_en ?: commune.name_fr
                                    AppLanguage.FR -> commune.name_fr
                                }

                                Surface(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clip(RoundedCornerShape(8.dp))
                                        .then(
                                            if (isHighlighted)
                                                Modifier.border(
                                                    1.5.dp,
                                                    MaterialTheme.colorScheme.primary,
                                                    RoundedCornerShape(8.dp)
                                                )
                                            else Modifier
                                        ),
                                    color = if (isHighlighted)
                                        MaterialTheme.colorScheme.primary.copy(alpha = 0.08f)
                                    else
                                        MaterialTheme.colorScheme.surface
                                ) {
                                    Row(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(horizontal = 10.dp, vertical = 8.dp),
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Row(
                                            verticalAlignment = Alignment.CenterVertically,
                                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                                            modifier = Modifier.weight(1f)
                                        ) {
                                            Surface(
                                                shape = RoundedCornerShape(6.dp),
                                                color = MaterialTheme.colorScheme.primary.copy(alpha = 0.12f),
                                                modifier = Modifier.padding(1.dp)
                                            ) {
                                                Text(
                                                    text = commune.hcp_code,
                                                    style = MaterialTheme.typography.labelSmall,
                                                    fontWeight = FontWeight.Bold,
                                                    fontFamily = FontFamily.Monospace,
                                                    color = MaterialTheme.colorScheme.primary,
                                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                                )
                                            }

                                            Column {
                                                Text(
                                                    text = communeName,
                                                    style = MaterialTheme.typography.bodyMedium,
                                                    fontWeight = FontWeight.SemiBold
                                                )
                                                if (language != AppLanguage.AR) {
                                                    Text(
                                                        text = commune.name_ar,
                                                        style = MaterialTheme.typography.labelSmall,
                                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                                    )
                                                }
                                            }
                                        }

                                        IconButton(
                                            onClick = {
                                                val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                                                val clip = ClipData.newPlainText("HCP Code", commune.hcp_code)
                                                clipboard.setPrimaryClip(clip)
                                                val toastMsg = when (language) {
                                                    AppLanguage.AR -> "تم نسخ رمز HCP: ${commune.hcp_code}"
                                                    AppLanguage.EN -> "HCP Code copied: ${commune.hcp_code}"
                                                    AppLanguage.FR -> "Code HCP copié: ${commune.hcp_code}"
                                                }
                                                Toast.makeText(context, toastMsg, Toast.LENGTH_SHORT).show()
                                            },
                                            modifier = Modifier.size(28.dp)
                                        ) {
                                            Icon(
                                                imageVector = Icons.Default.ContentCopy,
                                                contentDescription = "Copy HCP Code",
                                                modifier = Modifier.size(15.dp),
                                                tint = MaterialTheme.colorScheme.onSurfaceVariant
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
