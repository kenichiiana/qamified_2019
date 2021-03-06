<template>
  <div class="container" id="quest">
    <b-modal :active.sync="showFlagModal" :width="650">
      <div id="modal">
        <div class="box has-text-centered">
          <p class="is-primary-text">This quest is a duplicate of...</p>
          <p class="is-secondary-text">(Choose from the following)</p>
          <p class="is-divider"></p>
          <div class="scrollable">
            <div
              v-for="q in questList"
              :key="q.index"
              class="notification is-primary-text color-white"
              id="quest-list-panel"
              v-on:click.prevent="flagQuest(quest, q)"
            >
              {{ q.title }}
            </div>
          </div>
        </div>
      </div>
    </b-modal>
    <div
      v-if="quest.is_duplicate"
      class="notification has-text-centered"
      id="duplicate-notif"
    >
      This quest was deemed as a duplicate of
      <router-link :to="`/quest/${quest.duplicate_of}`">
        this quest
      </router-link>
    </div>
    <div class="box" id="quest-container">
      <div class="media">
        <!-- Votes container -->
        <div class="media-left has-text-centered has-text-grey-lighter">
          <p>
            <span
              class="mdi mdi-arrow-up-bold-circle-outline active-vote"
              v-on:click.prevent="upvoteQuest"
              v-if="quest.upvote.includes(user.id)"
            ></span>
            <span
              class="mdi mdi-arrow-up-bold-circle-outline"
              v-on:click.prevent="upvoteQuest"
              v-else-if="!quest.upvote.includes(user.id)"
            ></span>
          </p>
          <!-- Vote Count -->
          <p>
            <span class="is-primary-text" id="votes">
              {{ quest.votes }}
            </span>
          </p>
          <!-- Downvote Quest -->
          <p>
            <span
              class="mdi mdi-arrow-down-bold-circle-outline active-vote"
              v-on:click.prevent="downvoteQuest"
              v-if="quest.downvote.includes(user.id)"
            ></span>
            <span
              class="mdi mdi-arrow-down-bold-circle-outline"
              v-on:click.prevent="downvoteQuest"
              v-else-if="!quest.downvote.includes(user.id)"
            ></span>
          </p>
          <p class="is-divider"></p>
          <p>
            <b-tooltip
              label="Flag quest as a duplicate quest"
              type="is-light"
              position="is-left"
              animated
            >
              <span
                v-on:click.prevent="popFlagModal"
                class="mdi mdi-flag-variant-outline"
              ></span>
            </b-tooltip>
          </p>
        </div>
        <div class="media-content" id="quest-primary-container">
          <!-- Quest-primary-header -->
          <div class="is-clearfix">
            <div class="is-pulled-left">
              <p class="title is-3 is-primary-text">{{ quest.title }}</p>
            </div>
            <div class="is-pulled-right">
              <b-tooltip
                v-if="quest.is_answered"
                label="Quest has already been answered correctly"
                type="is-light"
                position="is-bottom"
              >
                <span class="mdi mdi-check-outline" id="is-answered"></span>
              </b-tooltip>
              <b-tooltip
                label="Delete this quest"
                type="is-light"
                position="is-right"
                animated
              >
                <span
                  class="mdi mdi-close"
                  v-if="user.id === quest.user_id || user.is_admin"
                  v-on:click.prevent="confirmDelete"
                  id="quest-close"
                ></span>
              </b-tooltip>
            </div>
          </div>
          <!-- Quest.description -->
          <div class="is-secondary-text" id="quest-description-container">
            <vue-markdown>{{ quest.description }}</vue-markdown>
          </div>
          <div class="is-clearfix">
            <div class="is-pulled-right" id="sns-share">
              <span class="subtitle is-7 is-secondary-text">Share to: </span>
              <social-sharing
                :url="`http://qamified.tk/quest/${quest.id}`"
                title="I have posted/found a quest, can you help us with this one?"
                description="QAmifiED is a gamified collaborative QnA platform"
                quote="Can you help me in this quest?"
                hashtags="qamified,sablay2019"
                inline-template
              >
                <div>
                  <network network="facebook">
                    <span
                      style="font-size: 1.5em; cursor: pointer; color: #17b79c;"
                      class="mdi mdi-facebook-box"
                    ></span>
                  </network>
                  <network network="twitter">
                    <span
                      style="font-size: 1.5em; cursor: pointer; color: #17b79c;"
                      class="mdi mdi-twitter-box"
                    ></span>
                  </network>
                </div>
              </social-sharing>
            </div>
          </div>
          <div class="is-divider"></div>
          <div class="is-clearfix" id="quest-miscellaneous-container">
            <p class="is-pulled-left">
              <span class="subtitle is-7">Category:</span>&nbsp;
              <span class="tag is-light quest-tag is-secondary-text">
                {{ quest.category }}
              </span>
            </p>
            <div
              class="media is-pulled-right has-text-centered"
              id="adventurer-info"
            >
              <figure class="media-left image is-32x32">
                <img
                  :src="`../../${quest.user_img_url}`"
                  alt="adventurer image"
                  class="is-rounded"
                />
              </figure>
              <div class="media-content">
                <b-tooltip
                  label="Click to view headquarters"
                  type="is-light"
                  position="is-right"
                  animated
                >
                  <router-link :to="`/headquarters/${quest.user_id}`">
                    <p class="title is-secondary-text" id="info-name">
                      {{ quest.full_name }}
                    </p>
                  </router-link>
                </b-tooltip>
                <p class="subtitle is-secondary-text" id="info-time">
                  Posted {{ quest.date_created | date }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <article class="media">
      <figure class="media-left">
        <p class="image is-64x64">
          <img :src="`../${user.img_url}`" />
        </p>
      </figure>
      <div class="media-content">
        <div class="field">
          <p class="control">
            <textarea
              class="textarea"
              placeholder="Offer assistance..."
              v-model="solution.description"
            ></textarea>
          </p>
        </div>
        <nav class="level">
          <div class="level-left"></div>
          <div class="level-right">
            <div class="level-item">
              <button
                v-on:click.prevent="postSolution"
                class="button primary-btn is-secondary-text"
              >
                Leave a response
              </button>
            </div>
          </div>
        </nav>
        <div class="is-divider" data-content="SOLUTIONS"></div>
        <!-- Solutions -->
        <div id="solutions">
          <Solution
            v-for="solution in solutions"
            :key="solution.id"
            v-bind:solution="solution"
          />
        </div>
      </div>
    </article>
  </div>
</template>

<script>
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';
import VueMarkdown from 'vue-markdown';
import Solution from './Solution';

export default {
  props: ['id'],
  components: {
    Solution,
    VueMarkdown
  },
  data() {
    return {
      solution: {
        description: '',
        date_created: moment().format(),
        votes: 0,
        user_id: '',
        username: '',
        full_name: '',
        is_correct: false,
        quest_id: this.id
      },
      showFlagModal: false
    };
  },
  computed: {
    ...mapGetters({
      user: 'user/getUser',
      loading: 'quest/isLoading',
      solutions: 'quest/sortedSolutions',
      loadQuest: 'feed/loadQuest',
      quests: 'feed/sortedQuests'
    }),
    quest() {
      return this.loadQuest(this.id);
    },
    questList() {
      const questArray = this.quests;
      return questArray.filter(q => this.id !== q.id);
    }
  },
  methods: {
    ...mapActions({
      upvote: 'feed/upvoteQuest',
      downvote: 'feed/downvoteQuest',
      post: 'quest/postSolution',
      refresh: 'quest/populateSolutions',
      delete: 'feed/deleteQuest',
      log: 'user/updateLogs',
      submit: 'quest/submitFlagToAdmin'
    }),
    upvoteQuest: function upvoteQuest() {
      this.upvote(this.loadQuest(this.id));
    },
    downvoteQuest: function downvoteQuest() {
      this.downvote(this.loadQuest(this.id));
    },
    postSolution: function postSolution() {
      if (this.solution.description) {
        this.post({
          ...this.solution,
          user_id: this.user.id,
          username: this.user.username,
          full_name: this.user.fname
        });
        this.solution.description = '';
      } else {
        // eslint-disable-next-line
        alert('Please fill in the required fields.');
      }
    },
    populateSolutions: function populateSolutions() {
      this.log('VIEW_QUEST');
      this.refresh(this.id);
    },
    confirmDelete: function confirmDelete() {
      this.$dialog.confirm({
        title: 'Deleting quest',
        message:
          'Are you sure you want to <b>delete</b> this quest? This action cannot be undone.',
        confirmText: 'Yes, I am sure.',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => this.delete(this.quest.id)
      });
      this.$router.push('/board');
    },
    flagQuest: function flagQuest(duplicate, quest) {
      this.submit({
        user_id: this.user.id,
        user_name: this.user.fname,
        duplicate_id: duplicate.id,
        duplicate_title: duplicate.title,
        quest_id: quest.id,
        quest_title: quest.title,
        date_created: moment().format()
      });
      this.showFlagModal = false;
    },
    popFlagModal() {
      this.showFlagModal = true;
    }
  },
  mounted() {
    this.populateSolutions();
  }
};
</script>

<style scoped>
#quest {
  width: 100% !important;
  padding-top: 75px !important;
  padding-bottom: 15px !important;
}
.active-vote {
  color: #17b79c !important;
}
.tag {
  background-color: #17b79c !important;
  color: #ffffff !important;
}
.mdi {
  font-size: 2em !important;
  cursor: pointer !important;
  font-weight: bold !important;
}
.mdi:hover {
  color: #37ccb3 !important;
}
#quest-primary-container {
  padding: 0.5em !important;
}
#quest-description-container {
  background: #eff0f1 !important;
  margin-top: 1em !important;
  border: 3px solid #f4f4f4 !important;
  max-width: 100% !important;
  width: 100% !important;
  overflow-wrap: break-word !important;
  word-wrap: break-word !important;
  hyphens: auto !important;
  font-size: 1em !important;
  padding: 5px !important;
  color: #242729 !important;
}
#adventurer-info {
  padding: 15px !important;
  background-color: #eef7ed !important;
}
#info-name,
#info-time {
  font-size: 0.8em !important;
}
#info-name:hover {
  color: #17b79c !important;
}
#sns-share {
  margin-right: 15px !important;
  margin-top: 5px !important;
}
.flagged {
  color: #ff0266 !important;
}
#is-answered {
  color: #45a163 !important;
  font-size: 1.3em !important;
}
#quest-close {
  font-size: 15px !important;
  color: #b9b9b9 !important;
  cursor: pointer !important;
}
.scrollable {
  overflow-y: scroll !important;
  height: 450px !important;
  padding: 15px;
}
#quest-list-panel {
  background-color: #37ccb3 !important;
  cursor: pointer;
}
#quest-list-panel:hover {
  background-color: #17b79c !important;
}
#duplicate-notif {
  width: 100% !important;
  background: #ffffff !important;
  border: 2px solid #b33a3a !important;
}
</style>
