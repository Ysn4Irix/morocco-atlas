package com.moroccoapi.atlas.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.moroccoapi.atlas.data.local.ProvinceEntity
import com.moroccoapi.atlas.data.local.RegionEntity
import com.moroccoapi.atlas.ui.AppLanguage

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProvincesScreen(
    region: RegionEntity,
    provinces: List<ProvinceEntity>,
    language: AppLanguage,
    onBack: () -> Unit,
    onProvinceClick: (ProvinceEntity) -> Unit,
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
                            text = "${provinces.size} subdivisions",
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
                ProvinceCard(
                    province = province,
                    language = language,
                    onClick = { onProvinceClick(province) }
                )
            }
        }
    }
}

@Composable
fun ProvinceCard(
    province: ProvinceEntity,
    language: AppLanguage,
    onClick: () -> Unit
) {
    val displayName = when (language) {
        AppLanguage.AR -> province.name_ar
        AppLanguage.EN -> province.name_en ?: province.name_fr
        AppLanguage.FR -> province.name_fr
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(14.dp))
            .clickable(onClick = onClick),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp)
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
                imageVector = Icons.Default.ChevronRight,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}
