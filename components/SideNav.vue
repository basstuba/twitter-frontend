<template>
    <div class="side-nav">
        <div class="title">
            <img class="title-logo" :src="require('@/assets/images/logo.png')" alt="ロゴ" />
        </div>
        <div class="nav-link">
            <NuxtLink class="nav-nuxt" to="/">
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
                    <textarea class="content-text" v-model="post" name="メッセージ" id="share" cols="10" rows="10"></textarea>
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

<style scoped>
.side-nav {
    width: 100%;
}

.title-logo {
    width: 30%;
}

.nav-link,
.nav-logout {
    margin-top: 1rem;
}

.nav-nuxt {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    text-decoration: none;
}

.nav-icon {
    width: 7%;
}

.nav-name {
    color: #fff;
    margin-left: 1rem;
}

.logout-button {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: #000;
    border: none;
    padding: 0;
}

.content {
    width: 100%;
    margin-top: 2rem;
}

.content-title {
    color: #fff;
    display: block;
}

.content-text {
    width: 70%;
    padding: 0.5rem;
    margin-top: 1rem;
    background-color: #000;
    color: #fff;
    border: 0.1rem solid #fff;
    border-radius: 1rem;
}

.content-button {
    text-align: right;
    width: 70%;
}

.button-click {
    color: #fff;
    background-color: #5100ff;
    border-radius: 3rem;
    padding: 0.5rem 1.5rem;
    margin-top: 1rem;
}

.error {
    color: #ff2d2d;
}
</style>