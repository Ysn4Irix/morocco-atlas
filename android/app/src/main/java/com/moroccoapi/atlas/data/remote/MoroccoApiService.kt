package com.moroccoapi.atlas.data.remote

import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.GET
import java.util.concurrent.TimeUnit

interface MoroccoApiService {

    @GET("status")
    suspend fun getStatus(): StatusResponse

    @GET("regions")
    suspend fun getRegions(): RegionsResponse

    @GET("provinces")
    suspend fun getProvinces(): ProvincesResponse

    @GET("communes")
    suspend fun getCommunes(): CommunesResponse

    companion object {
        private const val BASE_URL = "https://moroccodb.ysnirix.xyz/api/v1/"

        fun create(): MoroccoApiService {
            val logging = HttpLoggingInterceptor().apply {
                level = HttpLoggingInterceptor.Level.BASIC
            }

            val client = OkHttpClient.Builder()
                .addInterceptor(logging)
                .connectTimeout(10, TimeUnit.SECONDS)
                .readTimeout(15, TimeUnit.SECONDS)
                .build()

            return Retrofit.Builder()
                .baseUrl(BASE_URL)
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
                .create(MoroccoApiService::class.java)
        }
    }
}
