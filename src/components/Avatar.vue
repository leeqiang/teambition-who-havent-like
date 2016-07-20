<template lang="pug">
.avatar
  .image(v-bind:style="{ backgroundImage: `url(${url})` }")
    .image-mask(v-bind:style="{ backgroundColor: hasLiked ? 'rgba(255, 255, 255, 0.9)' : 'transparent' }")
  .name(v-bind:style="{ color: hasLiked ? '#ccc' : '#2c3e50' }") {{ name }}
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    hasLiked: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar {
  display: inline-block;

  .image {
    position: relative;

    width: 60px;
    height: 60px;
    margin: 2px;

    border-radius: 30px;
    background-position: center;
    background-size: cover;
  }

  .image-mask {
    position: relative;
    top: -2px;
    left: -2px;

    width: 64px;
    height: 64px;

    border-radius: 32px;
    background-position: center;
    background-size: cover;
  }

  .name {
    width: 64px;
    height: 24px;
    margin-top: 5px;

    text-align: center;
    white-space:nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;

    line-height: 24px;
  }
}
</style>
