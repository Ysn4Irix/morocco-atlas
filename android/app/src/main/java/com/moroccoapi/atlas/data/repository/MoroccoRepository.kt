package com.moroccoapi.atlas.data.repository

import com.moroccoapi.atlas.data.local.CommuneEntity
import com.moroccoapi.atlas.data.local.MetadataEntity
import com.moroccoapi.atlas.data.local.MoroccoDao
import com.moroccoapi.atlas.data.local.ProvinceEntity
import com.moroccoapi.atlas.data.local.RegionEntity
import com.moroccoapi.atlas.data.remote.MoroccoApiService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.withContext

class MoroccoRepository(
    private val dao: MoroccoDao,
    private val api: MoroccoApiService = MoroccoApiService.create()
) {

    val allRegions: Flow<List<RegionEntity>> = dao.getAllRegions()

    fun getProvincesByRegion(regionCode: String): Flow<List<ProvinceEntity>> =
        dao.getProvincesByRegion(regionCode)

    fun getCommunesByProvince(provinceCode: String): Flow<List<CommuneEntity>> =
        dao.getCommunesByProvince(provinceCode)

    fun searchRegions(query: String): Flow<List<RegionEntity>> =
        dao.searchRegions(query)

    fun searchProvinces(query: String): Flow<List<ProvinceEntity>> =
        dao.searchProvinces(query)

    fun searchCommunes(query: String): Flow<List<CommuneEntity>> =
        dao.searchCommunes(query)

    suspend fun getRegionByCode(code: String): RegionEntity? = withContext(Dispatchers.IO) {
        dao.getRegionByCode(code)
    }

    suspend fun getProvinceByCode(code: String): ProvinceEntity? = withContext(Dispatchers.IO) {
        dao.getProvinceByCode(code)
    }

    suspend fun getLocalCounts(): Triple<Int, Int, Int> = withContext(Dispatchers.IO) {
        val reg = dao.getRegionsCount()
        val prov = dao.getProvincesCount()
        val comm = dao.getCommunesCount()
        Triple(reg, prov, comm)
    }

    suspend fun checkAndSyncUpdates(): Result<String> = withContext(Dispatchers.IO) {
        try {
            val status = api.getStatus()
            val remoteVersion = status.data.version
            val localVersion = dao.getMetadata("version") ?: "1.0.0"

            if (remoteVersion != localVersion) {
                // Fetch and update
                val regionsResp = api.getRegions()
                val provincesResp = api.getProvinces()
                val communesResp = api.getCommunes()

                dao.insertRegions(regionsResp.data.map {
                    RegionEntity(
                        code = it.code,
                        hcp_code = it.hcpCode,
                        name_ar = it.name.ar,
                        name_fr = it.name.fr,
                        name_en = it.name.en
                    )
                })

                dao.insertProvinces(provincesResp.data.map {
                    ProvinceEntity(
                        code = it.code,
                        hcp_code = it.hcpCode,
                        administrative_type = it.administrativeType,
                        name_ar = it.name.ar,
                        name_fr = it.name.fr,
                        name_en = it.name.en,
                        region_code = it.regionCode
                    )
                })

                dao.insertCommunes(communesResp.data.map {
                    CommuneEntity(
                        code = it.code,
                        hcp_code = it.hcpCode,
                        name_ar = it.name.ar,
                        name_fr = it.name.fr,
                        name_en = it.name.en,
                        cercle_hcp_code = it.cercleHcpCode,
                        province_code = it.provinceCode,
                        region_code = it.regionCode
                    )
                })

                dao.insertMetadata(MetadataEntity("version", remoteVersion))
                dao.insertMetadata(MetadataEntity("timestamp", status.data.timestamp))

                Result.success("Updated to version $remoteVersion successfully")
            } else {
                Result.success("Data is up-to-date (v$localVersion)")
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
