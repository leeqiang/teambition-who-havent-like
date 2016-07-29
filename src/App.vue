<template lang="pug">
#app
  template(v-if="params.task")
    template(v-if="task")
      h2.text-center 谁没点赞「{{ task.content }}」
      h3 参与者列表
      .avatars
        avatar(v-for="id in involvedMembers", @click="addReciever(id)", :name="members[id].name", :url="members[id].avatarUrl", :has-liked="likedMembers[id] !== undefined")
      h3 发私聊催促
      p 发送对象
      span.reciever(v-for="id in message.recievers", @click="removeReciever(id)") {{ members[id].name }}
      p 发送内容
      textarea(rows="5", v-model="message.content")
      .button(@click="sendMessage()") 发送
    h2.text-center(v-else) 加载任务信息中...
  template(v-else)
    h2.text-center 谁没点赞
    p.text-center 未指定任务，请从任务菜单中打开插件
</template>

<script>
import qs from 'querystring'
import _ from 'lodash'

export default {
  data: function () {
    return {
      access_token: 'ACCESS_TOKEN',
      params: qs.parse(window.location.search.substr(1)),
      task: null,
      members: {},
      likedMembers: {},
      message: {
        recievers: [],
        content: ''
      }
    }
  },
  computed: {
    involvedMembers: function () {
      return _.intersection(this.task.involveMembers, Object.keys(this.members))
    }
  },
  ready: function () {
    if (this.params.task) {
      this.$http({
        url: `https://api.teambition.com/api/tasks/${this.params.task}`,
        method: 'GET',
        params: {
          access_token: this.access_token
        }
      }).then((res) => {
        this.task = res.json()

        this.message.content = `快来点赞任务「${this.task.content}」吧，就差你了：https://www.teambition.com/project/${this.task._projectId}/tasks/scrum/${this.task._tasklistId}/task/${this.task._id}`

        this.$http({
          url: `https://api.teambition.com/api/tasks/${this.params.task}/like`,
          method: 'GET',
          params: {
            all: 1,
            access_token: this.access_token
          }
        }).then((res) => {
          let likes = res.json().likesGroup
          this.likedMembers = _.zipObject(_.map(likes, '_id'), likes)

          this.$http({
            url: `https://api.teambition.com/api/v2/projects/${this.task._projectId}/members`,
            method: 'GET',
            params: {
              access_token: this.access_token
            }
          }).then((res) => {
            let members = res.json()
            this.members = _.zipObject(_.map(members, '_id'), members)
            this.message.recievers = _.difference(this.involvedMembers, Object.keys(this.likedMembers))
          })
        })
      })
    }
  },
  methods: {
    addReciever: function (id) {
      this.message.recievers = _.union(this.message.recievers, [id])
    },
    removeReciever: function (id) {
      this.message.recievers = _.difference(this.message.recievers, [id])
    },
    sendMessage: function () {
      window.alert('等待 Teambition API 更新中...')
    }
  },
  components: {
    avatar: require('components/Avatar')
  }
}
</script>

<style lang="scss">
.text-center {
  text-align: center;
}

#app {
  color: #2c3e50;
  user-select: none;

  .avatars {
    display: flex;
    flex-direction: row;

    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-end;

    .avatar { cursor: pointer; }
  }

  .reciever {
    display: inline-block;

    height: 20px;
    margin: 1px;
    padding: 3px 5px;

    cursor: pointer;

    border-radius: 10px;
    background-color: #efefef;

    font-size: 14px;
    line-height: 20px;

    &:hover::after {
      content: ' ×';
    }
  }

  textarea {
    width: 100%;
  }

  .button {
    float: right;
    margin: 10px 0;
    padding: 5px 20px;

    color: white;
    border: solid 0;
    background-color: #4aaa4a;

    cursor: pointer;
  }
}
</style>
