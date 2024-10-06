<template>
    <div class="message">
        <div class="detail">
            <p class="detail-name">{{ post.user.name }}</p>
            <img class="detail-like" @click="handleToggleLike" :src="require('@/assets/images/heart.png')" alt="いいね" />
            <p class="like-count">{{ post.likes.length }}</p>
            <img class="detail-delete" @click="emitDeletePost" :src="require('@/assets/images/cross.png')" alt="削除" />
            <img class="detail-link"
                @click="goPostDetail"
                v-if="$route.name === 'index'"
                :src="require('@/assets/images/detail.png')"
                alt="詳細" />
        </div>
        <div class="content">
            <p class="content-text">{{ post.post }}</p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        post: Object,
        uid: String,
    },
    methods: {
        async handleToggleLike() {
            if (this.isLiked()) {
                this.$emit("unlike");
            } else {
                this.$emit("like");
            }
        },

        isLiked() {
            const userIds = this.post.likes.map((like) => like.user_id);
            return userIds.includes(this.uid);
        },

        emitDeletePost() {
            this.$emit("deletePost", this.post);
        },

        goPostDetail() {
            this.$router.push(`/posts/${this.post.id}`);
        },
    },
}
</script>

<style scoped>
.message {
    width: 100%;
    border: 0.1rem solid #fff;
    margin-top: 1rem;
    padding: 1rem;
}

.detail {
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.detail-name {
    color: #fff;
    font-size: large;
    font-weight: bold;
}

.like-count {
    color: #fff;
}

.detail-like,
.detail-delete {
    width: 2.5%;
    margin: 0 1rem;
}

.detail-link {
    width: 2.5%;
    margin-left: 2rem;
}

.content {
    margin: 1rem 0;
}

.content-text {
    color: #fff;
}
</style>