<template>
    <div class="header">
        <div class="title">
            <img class="title-logo" :src="require('@/assets/images/logo.png')" alt="ロゴ" />
        </div>
        <div class="auth-link">
            <NuxtLink class="link-register" to="/register">新規登録</NuxtLink>
            <NuxtLink class="link-login" to="/login">ログイン</NuxtLink>
        </div>
    </div>
</template>