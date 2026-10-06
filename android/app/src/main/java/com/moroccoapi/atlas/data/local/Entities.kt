package com.moroccoapi.atlas.data.local

import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(tableName = "regions")
data class RegionEntity(
    @PrimaryKey val code: String,
    val hcp_code: String,
    val name_ar: String,
    val name_fr: String,
    val name_en: String?
)

@Entity(
    tableName = "provinces",
    indices = [Index(value = ["region_code"])]
)
data class ProvinceEntity(
    @PrimaryKey val code: String,
    val hcp_code: String,
    val administrative_type: String,
    val name_ar: String,
    val name_fr: String,
    val name_en: String?,
    val region_code: String
)

@Entity(
    tableName = "communes",
    indices = [Index(value = ["province_code"]), Index(value = ["region_code"])]
)
data class CommuneEntity(
    @PrimaryKey val code: String,
    val hcp_code: String,
    val name_ar: String,
    val name_fr: String,
    val name_en: String?,
    val cercle_hcp_code: String?,
    val province_code: String,
    val region_code: String
)

@Entity(
    tableName = "arrondissements",
    indices = [Index(value = ["commune_code"])]
)
data class ArrondissementEntity(
    @PrimaryKey val code: String,
    val hcp_code: String,
    val name_ar: String,
    val name_fr: String,
    val name_en: String?,
    val commune_code: String,
    val prefecture_of_arrondissements_code: String?,
    val province_code: String,
    val region_code: String
)

@Entity(tableName = "metadata")
data class MetadataEntity(
    @PrimaryKey val key: String,
    val value: String
)
