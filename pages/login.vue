<template>
    <div class="login">
        <div class="login-header">
            <AuthHeader />
        </div>
        <div class="login-content">
            <div class="content-title">
                <h2 class="title-logo">ログイン</h2>
            </div>
            <div class="content-email">
                <input class="content-input" type="email" v-model="email" placeholder="メールアドレス" required />
            </div>
            <div class="content-password">
                <input class="content-input" type="password" v-model="password" placeholder="パスワード" required />
            </div>
            <div class="content-button">
                <button class="button-click" @click="login">ログイン</button>
            </div>
        </div>
    </div>
</template>

<script>
import firebase from "../plugins/firebase";

export default {
    data() {
        return {
            email: null,
            password: null,
        };
    },
    methods: {
        login() {
            if (!this.email || !this.password) {
                alert("メールアドレスまたはパスワードが入力されていません。");
                return;
            }
            firebase.auth()
                .signInWithEmailAndPassword(this.email, this.password)
                .then(() => {
                    alert("ログインが完了しました");
                    this.$router.push("/");
                })
                .catch((error) => {
                    switch (error.code) {
                        case "auth/invalid-email":
                            alert("メールアドレスの形式が違います。")
                            break;
                        case "auth/user-disabled":
                            alert("ユーザーが無効になっています。")
                            break;
                        case "auth/user-not-found":
                            alert("ユーザーが存在しません。")
                            break;
                        case "auth/wrong-password":
                            alert("パスワードが間違っております。")
                            break;
                        default:
                            alert("エラーが起きました。しばらくしてから再度お試しください。")
                            break;
                    }
                });
        },
    },
}
</script>

<style scoped>
.login-content {
    width: 35%;
    background-color: #fff;
    margin: 3rem auto;
    padding: 2rem;
    text-align: center;
    border-radius: 0.3rem;
}

.content-input {
    width: 100%;
    border-radius: 1rem;
    margin: 1rem 0;
    padding: 0.7rem 0.5rem;
}

.button-click {
    color: #fff;
    background-color: #5100ff;
    border-radius: 3rem;
    font-size: large;
    padding: 0.5rem 1.5rem;
}
</style>