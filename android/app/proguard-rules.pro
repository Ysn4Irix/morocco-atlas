# Room Database
-keep class androidx.room.** { *; }
-dontwarn androidx.room.**

# Retrofit & Gson
-keepattributes Signature
-keepattributes *Annotation*
-keep class com.moroccoapi.atlas.data.remote.** { *; }
