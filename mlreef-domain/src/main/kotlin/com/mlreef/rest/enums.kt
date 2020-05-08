package com.mlreef.rest

enum class AccessLevel(val accessCode: Int) {
    GUEST(10),
    REPORTER(20),
    DEVELOPER(30),
    MAINTAINER(40),
    OWNER(50);

    companion object {
        @JvmStatic
        fun fromCode(code: Int?): AccessLevel? {
            return values().firstOrNull { it.accessCode == code }
        }

        @JvmStatic
        fun isSufficientFor(instance: AccessLevel?, limit: AccessLevel?): Boolean {
            if (limit == null) return true
            if (instance == null) return false
            return instance.accessCode >= limit.accessCode
        }
    }

    fun satisfies(limit: AccessLevel?) = isSufficientFor(this, limit)
}
