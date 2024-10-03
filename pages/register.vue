<template>
    <div class="register">
        <div class="register-header">
            <AuthHeader />
        </div>
        <div class="register-content">
            <div class="content-title">
                <h2 class="title-logo">新規登録</h2>
            </div>
            <validation-observer ref="obs" v-slot="ObserverProps">
                <div class="content-name">
                    <validation-provider v-slot="ProviderProps" rules="required|max:20">
                        <input class="content-input" type="text" v-model="name" name="ユーザーネーム" placeholder="ユーザーネーム" />
                        <div class="error">
                            {{ ProviderProps.errors[0] }}
                        </div>
                    </validation-provider>
                </div>
                <div class="content-email">
                    <input class="content-input" type="email" v-model="email" placeholder="メールアドレス" required />
                </div>
                <div class="content-password">
                    <input class="content-input" type="text" v-model="password" placeholder="パスワード" required />
                </div>
                <div class="content-button">
                    <button class="button-click" @click="register"
                    :disabled="ObserverProps.invalid || !ObserverProps.validated">
                        新規登録
                    </button>
                </div>
            </validation-observer>
        </div>
    </div>
</template>

<script>
import firebase from "../plugins/firebase";

export default {
    data() {
        return {
            name: null,
            email: null,
            password: null,
        };
    },
    methods: {
        register() {
            if (!this.email || !this.password) {
                alert("メールアドレスまたはパスワードが入力されていません。");
                return;
            }
            firebase.auth()
                .createUserWithEmailAndPassword(this.email, this.password)
                .then((data) => {
                    const sendData = {
                        id: data.user.uid,
                        name: this.name,
                    };
                    this.$axios.post("http://localhost/api/v1/user", sendData);
                    this.$router.replace("/login");
                })
                .catch((error) => {
                    switch (error.code) {
                        case "auth/invalid-email":
                            alert("メールアドレスの形式が違います。");
                            break;
                        case "auth/email-already-in-use":
                            alert("このメールアドレスはすでに使われています。");
                            break;
                        case "auth/weak-password":
                            alert("パスワードは6文字以上で入力してください。");
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
.register-content {
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

.error {
    color: #ff2d2d;
}
</style>