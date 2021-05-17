package com.mlreef.rest.domain

import com.mlreef.rest.domain.helpers.UserInGroup
import java.time.ZonedDateTime
import java.util.UUID
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.JoinColumn
import javax.persistence.OneToOne
import javax.persistence.Table

enum class UserRole {
    UNDEFINED,
    DATA_SCIENTIST,
    DEVELOPER,
    ML_ENGINEER,
    RESEARCHER,
    STUDENT,
    TEAM_LEAD,
}

@Entity
@Table(name = "account")
class Account(
    id: UUID,
    val username: String,
    val email: String,
    val passwordEncrypted: String,

    @OneToOne(fetch = FetchType.LAZY) //, cascade = [CascadeType.ALL])
//    @Cascade(org.hibernate.annotations.CascadeType.SAVE_UPDATE)
//    @JoinColumn(name = "person_id", foreignKey = ForeignKey(name = "account_subject_person_id_fkey"))
    @JoinColumn(name = "person_id")
    val person: Person,

    val lastLogin: ZonedDateTime? = null,
    // Token for changing account (change password, etc)
    val changeAccountToken: String? = null,
    val changeAccountTokenCreatedAt: ZonedDateTime? = null,

    // Auditing
    version: Long? = null,
    createdAt: ZonedDateTime? = null,
    updatedAt: ZonedDateTime? = null
) : AuditEntity(id, version, createdAt, updatedAt) {
    fun copy(
        id: UUID? = null,
        username: String? = null,
        email: String? = null,
        passwordEncrypted: String? = null,
        person: Person? = null,
        tokens: MutableList<AccountToken>? = null,
        lastLogin: ZonedDateTime? = null
    ): Account = Account(
        id = this.id,
        username = username ?: this.username,
        email = email ?: this.email,
        passwordEncrypted = passwordEncrypted ?: this.passwordEncrypted,
        person = person ?: this.person,
        lastLogin = lastLogin ?: this.lastLogin,
        version = this.version,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt,
        changeAccountToken = this.changeAccountToken,
        changeAccountTokenCreatedAt = this.changeAccountTokenCreatedAt
    )

    fun copyWithToken(
        changeAccountToken: String?,
        changeAccountTokenCreatedAt: ZonedDateTime?
    ): Account = Account(
        id = this.id,
        username = this.username,
        email = this.email,
        passwordEncrypted = this.passwordEncrypted,
        person = this.person,
        lastLogin = this.lastLogin,
        version = this.version,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt,
        changeAccountToken = changeAccountToken,
        changeAccountTokenCreatedAt = changeAccountTokenCreatedAt
    )

    fun toUserInGroup(accessLevel: AccessLevel?) = UserInGroup(
        id = this.id,
        userName = this.username,
        email = this.email,
        gitlabId = this.person.gitlabId,
        accessLevel = accessLevel
    )
}