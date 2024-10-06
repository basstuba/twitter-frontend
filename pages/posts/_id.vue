<template>
    <div class="comment-page">
        <div class="comment__side-nav">
            <SideNav />
        </div>
        <div class="main">
            <div class="main-title">コメント</div>
            <div class="message">
                <Message v-if="post" :post="post" :uid="uid" @like="like" @unlike="unlike" @deletePost="deletePost" />
            </div>
            <div class="main-content" v-if="post">
                <div class="content-title">コメント</div>
                <div class="content-comment" v-for="comment in post.comments" :key="comment.id">
                    <div class="user-name">{{ comment.user.name }}</div>
                    <div class="user-comment">{{ comment.comment }}</div>
                </div>
                <validation-observer ref="obs" v-slot="ObserverProps">
                    <div class="content-form">
                        <validation-provider v-slot="ProviderProps" rules="required|max:120">
                            <textarea class="form-text" v-model="content" name="コメント" cols="30" rows="2"></textarea>
                            <div class="error">
                                {{ ProviderProps.errors[0] }}
                            </div>
                        </validation-provider>
                    </div>
                    <div class="content-button">
                        <button class="button-click" @click="postComment"
                            :disabled="ObserverProps.invalid || !ObserverProps.validated">
                            コメント
                        </button>
                    </div>
                </validation-observer>
            </div>
        </div>
    </div>
</template>

<script>
import firebase from "~/plugins/firebase";

export default {
    data() {
        return {
            post: null,
            uid: null,
            content: null,
        };
    },

    methods: {
        async fetchPost() {
            const { data } = await this.$axios.get(`http://localhost/api/v1/post/${this.$route.params.id}`);
            this.post = data.post;
        },

        fetchData() {
            firebase.auth().onAuthStateChanged((user) => {
                this.uid = user.uid;
                this.fetchPost();
            });
        },

        async postComment() {
            const { data } = await this.$axios.post("http://localhost/api/v1/comment", {
                user_id: this.uid,
                post_id: this.post.id,
                comment: this.content,
            });
            this.post.comments.push(data.comment);
            this.content = "";
        },

        async like() {
            const { data } = await this.$axios.post("http://localhost/api/v1/like", {
                user_id: this.uid,
                post_id: this.post.id
            });
            this.post.likes.push(data.like);
        },

        async unlike() {
            const findLike = this.post.likes.find((like) => like.user_id === this.uid);
            await this.$axios.delete(`http://localhost/api/v1/like/${findLike.id}`);

            const findLikeIdx = this.post.likes.findIndex((like) => like.id === findLike.id);
            this.post.likes.splice(findLikeIdx, 1);
        },

        async deletePost(event) {
            await this.$axios.delete(`http://localhost/api/v1/post/${event.id}`);
            this.$router.push("/");
        },
    },
    created() {
        this.fetchData();
    },
}
</script>

<style scoped>
.comment-page {
    display: flex;
    justify-content: flex-start;
    padding: 2rem;
}

.comment__side-nav {
    width: 30%;
}

.main {
    width: 70%;
}

.main-title {
    color: #fff;
    font-size: x-large;
    margin: 0 0 2rem 1rem;
}

.content-title {
    color: #fff;
    text-align: center;
    margin: 1rem 0;
}

.content-comment {
    border: 0.1rem solid #fff;
    padding: 1rem;
    margin-bottom: 1rem;
}

.user-name {
    color: #fff;
    font-size: large;
    font-weight: bold;
    margin-bottom: 1rem;
}

.user-comment {
    color: #fff;
}

.form-text {
    width: 90%;
    display: block;
    background-color: #000;
    color: #fff;
    border: 0.1rem solid #fff;
    border-radius: 1rem;
    margin: 2rem auto 1rem;
}

.content-button {
    text-align: right;
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