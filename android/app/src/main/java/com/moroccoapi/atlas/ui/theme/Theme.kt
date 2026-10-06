package com.moroccoapi.atlas.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = MoroccoGreenLight,
    secondary = MoroccoRedAccent,
    tertiary = Color(0xFF26A69A),
    background = EmeraldSurfaceDark,
    surface = Color(0xFF192520),
    onPrimary = Color.White,
    onBackground = Color(0xFFE2EBE5),
    onSurface = Color(0xFFE2EBE5)
)

private val LightColorScheme = lightColorScheme(
    primary = MoroccoGreenPrimary,
    secondary = MoroccoRedAccent,
    tertiary = MoroccoGreenLight,
    background = EmeraldSurfaceLight,
    surface = Color.White,
    onPrimary = Color.White,
    onBackground = StoneTextDark,
    onSurface = StoneTextDark
)

@Composable
fun MoroccoAtlasTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
