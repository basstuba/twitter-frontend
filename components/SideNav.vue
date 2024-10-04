<template>
    <div class="side-nav">
        <div class="title">
            <img class="title-logo" :src="require('@/assets/images/logo.png')" alt="ロゴ" />
        </div>
        <div class="nav-link">
            <NuxtLink to="/">
                <img class="nav-icon" :src="require('@/assets/images/home.png')" alt="ホーム" />
                <p class="nav-name">ホーム</p>
            </NuxtLink>
        </div>
        <div class="nav-logout">
            <button class="logout-button" @click="logout">
                <img class="nav-icon" :src="require('@/assets/images/logout.png')" alt="ログアウト" />
                <p class="nav-name">ログアウト</p>
            </button>
        </div>
        <validation-observer ref="obs" v-slot="ObserverProps">
            <div class="content">
                <label class="content-title" for="share">シェア</label>
                <validation-provider v-slot="ProviderProps" rules="required|max:120">
                    <textarea class="content-text" v-model="post" name="post" id="share" cols="30" rows="10"></textarea>
                    <div class="error">
                        {{ ProviderProps.errors[0] }}
                    </div>
                </validation-provider>
            </div>
            <div class="content-button">
                <button class="button-click" @click="send"
                    :disabled="ObserverProps.invalid || !ObserverProps.validated">
                    シェアする
                </button>
            </div>
        </validation-observer>
    </div>
</template>

<script>
import firebase from "../plugins/firebase";

export default {
    data() {
        return {
            post: "",
        };
    },
    methods: {
        logout() {
            firebase.auth()
                .signOut()
                .then(() => {
                    alert("ログアウトが完了しました");
                    this.$router.replace("/login");
                });
        },

        send() {
            if (!this.post) {
                alert("シェアする内容を入力してください");
                return;
            }
            firebase.auth().onAuthStateChanged(async (user) => {
                const { data } = await this.$axios.post("http://localhost/api/v1/post", {
                    user_id: user.uid,
                    post: this.post
                });
                this.post = "";
                this.$emit("shared", data.post);
                alert("シェアしました");
            });
        },
    },
}
</script>