package com.moroccoapi.atlas

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import com.moroccoapi.atlas.data.local.AppDatabase
import com.moroccoapi.atlas.data.repository.MoroccoRepository
import com.moroccoapi.atlas.ui.AtlasApp
import com.moroccoapi.atlas.ui.AtlasViewModel
import com.moroccoapi.atlas.ui.AtlasViewModelFactory
import com.moroccoapi.atlas.ui.theme.MoroccoAtlasTheme

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val database = AppDatabase.getDatabase(applicationContext)
        val repository = MoroccoRepository(database.moroccoDao())
        val viewModelFactory = AtlasViewModelFactory(repository)
        val viewModel: AtlasViewModel by viewModels { viewModelFactory }

        setContent {
            MoroccoAtlasTheme {
                AtlasApp(viewModel = viewModel)
            }
        }
    }
}
