package com.moroccoapi.atlas.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface MoroccoDao {

    @Query("SELECT * FROM regions ORDER BY hcp_code ASC")
    fun getAllRegions(): Flow<List<RegionEntity>>

    @Query("SELECT * FROM regions WHERE code = :code LIMIT 1")
    suspend fun getRegionByCode(code: String): RegionEntity?

    @Query("SELECT * FROM provinces WHERE region_code = :regionCode ORDER BY name_fr ASC")
    fun getProvincesByRegion(regionCode: String): Flow<List<ProvinceEntity>>

    @Query("SELECT * FROM provinces ORDER BY name_fr ASC")
    fun getAllProvinces(): Flow<List<ProvinceEntity>>

    @Query("SELECT * FROM communes WHERE province_code = :provinceCode ORDER BY name_fr ASC")
    fun getCommunesByProvince(provinceCode: String): Flow<List<CommuneEntity>>

    @Query("SELECT * FROM communes WHERE region_code = :regionCode ORDER BY name_fr ASC")
    fun getCommunesByRegion(regionCode: String): Flow<List<CommuneEntity>>

    @Query("""
        SELECT * FROM communes 
        WHERE code LIKE '%' || :query || '%'
           OR hcp_code LIKE '%' || :query || '%'
           OR name_ar LIKE '%' || :query || '%'
           OR name_fr LIKE '%' || :query || '%'
           OR name_en LIKE '%' || :query || '%'
        LIMIT 50
    """)
    fun searchCommunes(query: String): Flow<List<CommuneEntity>>

    @Query("SELECT count(*) FROM regions")
    suspend fun getRegionsCount(): Int

    @Query("SELECT count(*) FROM provinces")
    suspend fun getProvincesCount(): Int

    @Query("SELECT count(*) FROM communes")
    suspend fun getCommunesCount(): Int

    @Query("SELECT value FROM metadata WHERE key = :key LIMIT 1")
    suspend fun getMetadata(key: String): String?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertRegions(regions: List<RegionEntity>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertProvinces(provinces: List<ProvinceEntity>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCommunes(communes: List<CommuneEntity>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMetadata(metadata: MetadataEntity)
}
