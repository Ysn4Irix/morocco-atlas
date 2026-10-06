package com.moroccoapi.atlas.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.moroccoapi.atlas.data.local.CommuneEntity
import com.moroccoapi.atlas.data.local.ProvinceEntity
import com.moroccoapi.atlas.data.local.RegionEntity
import com.moroccoapi.atlas.data.repository.MoroccoRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

enum class AppLanguage { AR, FR, EN }

@OptIn(kotlinx.coroutines.ExperimentalCoroutinesApi::class)
class AtlasViewModel(private val repository: MoroccoRepository) : ViewModel() {

    private val _language = MutableStateFlow(AppLanguage.FR)
    val language: StateFlow<AppLanguage> = _language.asStateFlow()

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _selectedRegion = MutableStateFlow<RegionEntity?>(null)
    val selectedRegion: StateFlow<RegionEntity?> = _selectedRegion.asStateFlow()

    private val _selectedProvince = MutableStateFlow<ProvinceEntity?>(null)
    val selectedProvince: StateFlow<ProvinceEntity?> = _selectedProvince.asStateFlow()

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

    val communesForSelectedProvince: StateFlow<List<CommuneEntity>> = _selectedProvince
        .flatMapLatest { prov ->
            if (prov != null) repository.getCommunesByProvince(prov.code) else flowOf(emptyList())
        }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val searchResults: StateFlow<List<CommuneEntity>> = _searchQuery
        .flatMapLatest { query ->
            if (query.trim().isNotEmpty()) repository.searchCommunes(query.trim()) else flowOf(emptyList())
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

    fun selectRegion(region: RegionEntity?) {
        _selectedRegion.value = region
        _selectedProvince.value = null
    }

    fun selectProvince(province: ProvinceEntity?) {
        _selectedProvince.value = province
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
