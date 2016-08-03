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
$inner-radius: 30px;
$outer-radius: 32px;

.avatar {
  display: inline-block;

  .image {
    position: relative;

    width: $inner-radius * 2;
    height: $inner-radius * 2;
    margin: $outer-radius - $inner-radius;

    border-radius: $inner-radius;
    background-position: center;
    background-size: cover;
  }

  .image-mask {
    position: relative;
    top: $inner-radius - $outer-radius;
    left: $inner-radius - $outer-radius;

    width: $outer-radius * 2;
    height: $outer-radius * 2;

    border-radius: $outer-radius;
    background-position: center;
    background-size: cover;
  }

  .name {
    width: $outer-radius * 2;
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
