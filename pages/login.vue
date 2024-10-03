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