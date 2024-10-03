<template>
    <div class="comment-page">
        <div class="side-nav">
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
                    <div class="user-name">{{ Comment.user.name }}</div>
                    <div class="user-comment">{{ Comment.comment }}</div>
                </div>
                <validation-observer ref="obs" v-slot="ObserverProps">
                    <div class="content-form">
                        <validation-provider v-slot="ProviderProps" rules="required|max:120">
                            <textarea class="form-text" v-model="content" name="content" cols="30" rows="2"></textarea>
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
                this.uid = user.id;
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
            post.likes.push(data.like);
        },

        async unlike() {
            const findLike = this.post.likes.find((like) => like.user_id === this.uid);
            await this.$axios.delete(`http://localhost/api/v1/like/${findLike.id}`);

            const findLikeIdx = post.likes.findindex((like) => like.id === findLike.id);
            post.likes.splice(findLikeIdx, 1);
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