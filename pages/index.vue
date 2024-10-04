<template>
  <div class="index">
    <div class="side-nav">
      <SideNav @shared="addPost" />
    </div>
    <div class="main">
      <div class="main-title">ホーム</div>
      <div class="main-content" v-for="post in posts" :key="post.id">
        <message
          :post="post"
          :uid="uid"
          @like="like(post)"
          @unlike="unlike(post)"
          @deletePost="deletePost"
        />
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "../plugins/firebase";

export default {
  middleware: "auth",
  data() {
    return {
      posts: [],
      uid: null,
    };
  },
  methods: {
    async getPostData() {
      const { data } = await this.$axios.get("http://localhost/api/v1/post");
      this.posts = data.posts;
    },

    fetchData() {
      firebase.auth().onAuthStateChanged((user) => {
        this.uid = user.uid;
        this.getPostData();
      });
    },

    async like(post) {
      const { data } = await this.$axios.post("http://localhost/api/v1/like", {
        user_id: this.uid,
        post_id: post.id
      });
      post.likes.push(data.like);
    },

    async unlike(post) {
      const findLike = post.likes.find((like) => like.user_id === this.uid);
      await this.$axios.delete(`http://localhost/api/v1/like/${findLike.id}`);

      const findLikeIdx = post.likes.findindex((like) => like.id === findLike.id);
      post.likes.splice(findLikeIdx, 1);
    },

    async deletePost(event) {
      await this.$axios.delete(`http://localhost/api/v1/post/${event.id}`);

      const findPostIdx = this.posts.findindex((post) => post.id === event.id);
      this.posts.splice(findPostIdx, 1);
    },

    addPost(post) {
      this.posts.push(post);
    },
  },
  created() {
    this.fetchData();
  },
}
</script>
