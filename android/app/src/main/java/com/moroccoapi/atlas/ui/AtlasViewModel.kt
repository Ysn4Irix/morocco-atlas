package com.moroccoapi.atlas.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.moroccoapi.atlas.data.local.CommuneEntity
import com.moroccoapi.atlas.data.local.ProvinceEntity
import com.moroccoapi.atlas.data.local.RegionEntity
import com.moroccoapi.atlas.data.repository.MoroccoRepository
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

enum class AppLanguage { AR, FR, EN }

data class UniversalSearchResult(
    val id: String,
    val code: String,
    val type: String, // "region", "province", "commune"
    val hcpCode: String,
    val nameAr: String,
    val nameFr: String,
    val nameEn: String?,
    val parentName: String? = null,
    val regionCode: String,
    val provinceCode: String? = null
)

@OptIn(kotlinx.coroutines.ExperimentalCoroutinesApi::class)
class AtlasViewModel(private val repository: MoroccoRepository) : ViewModel() {

    private val _language = MutableStateFlow(AppLanguage.FR)
    val language: StateFlow<AppLanguage> = _language.asStateFlow()

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _isSearchActive = MutableStateFlow(false)
    val isSearchActive: StateFlow<Boolean> = _isSearchActive.asStateFlow()

    private val _selectedRegion = MutableStateFlow<RegionEntity?>(null)
    val selectedRegion: StateFlow<RegionEntity?> = _selectedRegion.asStateFlow()

    private val _selectedProvince = MutableStateFlow<ProvinceEntity?>(null)
    val selectedProvince: StateFlow<ProvinceEntity?> = _selectedProvince.asStateFlow()

    private val _expandedProvinceCode = MutableStateFlow<String?>(null)
    val expandedProvinceCode: StateFlow<String?> = _expandedProvinceCode.asStateFlow()

    private val _highlightedCommuneCode = MutableStateFlow<String?>(null)
    val highlightedCommuneCode: StateFlow<String?> = _highlightedCommuneCode.asStateFlow()

    private val _syncMessage = MutableStateFlow<String?>(null)
    val syncMessage: StateFlow<String?> = _syncMessage.asStateFlow()

    private val _isSyncing = MutableStateFlow(false)
    val isSyncing: StateFlow<Boolean> = _isSyncing.asStateFlow()

    val regions: StateFlow<List<RegionEntity>> = repository.allRegions
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val provincesForSelectedRegion: StateFlow<List<ProvinceEntity>> = _selectedRegion
        .flatMapLatest { reg ->
            if (reg != null) repository.getProvincesByRegion(reg.code) else flowOf(emptyList())
        }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val communesForExpandedProvince: StateFlow<List<CommuneEntity>> = _expandedProvinceCode
        .flatMapLatest { code ->
            if (code != null) repository.getCommunesByProvince(code) else flowOf(emptyList())
        }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val communesForSelectedProvince: StateFlow<List<CommuneEntity>> = _selectedProvince
        .flatMapLatest { prov ->
            if (prov != null) repository.getCommunesByProvince(prov.code) else flowOf(emptyList())
        }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val searchResults: StateFlow<List<UniversalSearchResult>> = _searchQuery
        .flatMapLatest { query ->
            val q = query.trim()
            if (q.isEmpty()) {
                flowOf(emptyList())
            } else {
                combine(
                    repository.searchRegions(q),
                    repository.searchProvinces(q),
                    repository.searchCommunes(q)
                ) { regs, provs, comms ->
                    val list = mutableListOf<UniversalSearchResult>()
                    regs.forEach { r ->
                        list.add(
                            UniversalSearchResult(
                                id = "reg-${r.code}",
                                code = r.code,
                                type = "region",
                                hcpCode = r.hcp_code,
                                nameAr = r.name_ar,
                                nameFr = r.name_fr,
                                nameEn = r.name_en,
                                regionCode = r.code
                            )
                        )
                    }
                    provs.forEach { p ->
                        list.add(
                            UniversalSearchResult(
                                id = "prov-${p.code}",
                                code = p.code,
                                type = "province",
                                hcpCode = p.hcp_code,
                                nameAr = p.name_ar,
                                nameFr = p.name_fr,
                                nameEn = p.name_en,
                                regionCode = p.region_code,
                                provinceCode = p.code
                            )
                        )
                    }
                    comms.take(30).forEach { c ->
                        list.add(
                            UniversalSearchResult(
                                id = "comm-${c.code}",
                                code = c.code,
                                type = "commune",
                                hcpCode = c.hcp_code,
                                nameAr = c.name_ar,
                                nameFr = c.name_fr,
                                nameEn = c.name_en,
                                regionCode = c.region_code,
                                provinceCode = c.province_code
                            )
                        )
                    }
                    list
                }
            }
        }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    init {
        // Silent background check on app launch
        checkForUpdates(silent = true)
    }

    fun setLanguage(lang: AppLanguage) {
        _language.value = lang
    }

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun setSearchActive(active: Boolean) {
        _isSearchActive.value = active
        if (!active) {
            _searchQuery.value = ""
        }
    }

    fun toggleProvince(provinceCode: String) {
        _expandedProvinceCode.value = if (_expandedProvinceCode.value == provinceCode) null else provinceCode
    }

    fun selectRegion(region: RegionEntity?) {
        _selectedRegion.value = region
        _selectedProvince.value = null
        _expandedProvinceCode.value = null
        _highlightedCommuneCode.value = null
    }

    fun selectProvince(province: ProvinceEntity?) {
        _selectedProvince.value = province
    }

    fun selectSearchResult(item: UniversalSearchResult) {
        viewModelScope.launch {
            val reg = repository.getRegionByCode(item.regionCode)
            _selectedRegion.value = reg
            when (item.type) {
                "region" -> {
                    _expandedProvinceCode.value = null
                    _highlightedCommuneCode.value = null
                }
                "province" -> {
                    _expandedProvinceCode.value = item.provinceCode
                    _highlightedCommuneCode.value = null
                }
                "commune" -> {
                    _expandedProvinceCode.value = item.provinceCode
                    _highlightedCommuneCode.value = item.code
                }
            }
            _searchQuery.value = ""
            _isSearchActive.value = false
        }
    }

    fun checkForUpdates(silent: Boolean = false) {
        viewModelScope.launch {
            _isSyncing.value = true
            val result = repository.checkAndSyncUpdates()
            _isSyncing.value = false
            result.onSuccess { message ->
                if (!silent) {
                    _syncMessage.value = message
                }
            }.onFailure { err ->
                if (!silent) {
                    _syncMessage.value = "Sync failed: ${err.localizedMessage}"
                }
            }
        }
    }

    fun dismissSyncMessage() {
        _syncMessage.value = null
    }
}

class AtlasViewModelFactory(private val repository: MoroccoRepository) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(AtlasViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return AtlasViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
