package com.moroccoapi.atlas.data.remote

import com.google.gson.annotations.SerializedName

data class StatusResponse(
    @SerializedName("data") val data: StatusData
)

data class StatusData(
    @SerializedName("status") val status: String,
    @SerializedName("service") val service: String,
    @SerializedName("version") val version: String,
    @SerializedName("timestamp") val timestamp: String
)

data class LocalizedNameDto(
    @SerializedName("ar") val ar: String,
    @SerializedName("fr") val fr: String,
    @SerializedName("en") val en: String?
)

data class RegionDto(
    @SerializedName("code") val code: String,
    @SerializedName("hcp_code") val hcpCode: String,
    @SerializedName("type") val type: String,
    @SerializedName("name") val name: LocalizedNameDto
)

data class RegionsResponse(
    @SerializedName("data") val data: List<RegionDto>
)

data class ProvinceDto(
    @SerializedName("code") val code: String,
    @SerializedName("hcp_code") val hcpCode: String,
    @SerializedName("administrative_type") val administrativeType: String,
    @SerializedName("name") val name: LocalizedNameDto,
    @SerializedName("region_code") val regionCode: String
)

data class ProvincesResponse(
    @SerializedName("data") val data: List<ProvinceDto>
)

data class CommuneDto(
    @SerializedName("code") val code: String,
    @SerializedName("hcp_code") val hcpCode: String,
    @SerializedName("name") val name: LocalizedNameDto,
    @SerializedName("cercle_hcp_code") val cercleHcpCode: String?,
    @SerializedName("province_code") val provinceCode: String,
    @SerializedName("region_code") val regionCode: String
)

data class CommunesResponse(
    @SerializedName("data") val data: List<CommuneDto>
)
