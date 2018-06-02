new Vue({
    el: '#app',
    data: {
        is_welcome: false,
        is_content: false,
        is_home: true,
        is_rules: false,
        is_mine: false,
        is_square: false,
        is_vote: false,
        promise_title: '',
        promise_true: '',
        promise_false: '',
        promise_extra: '',
        username: '',
        endTime: '',
        username_flag: false,
        squareList: [],
        mineList: [],
        voteData: {
            author: '',
            id: '',
            option1: '',
            option1_num: '',
            option2: '',
            option2_num: '',
            title: '',
            content: '',
            answer: '',
            voted: [],
        },
    },
    methods: {
        setUsername() {
            const username = this.username;
            localStorage.setItem('username', username);
            this.username_flag = false;
        },
        home() {
            this.is_content = false;
            this.is_home = true;
            this.is_welcome = false;
            this.is_rules = false;
            this.is_square = false;
            this.is_mine = false;
            this.is_vote = false;
            this.username_flag = false;
        },
        next() {
            const flag = this.checkUser();
            if (!flag) {
                this.is_welcome = false;
                this.is_content = true;
                this.is_home = false;
                this.is_rules = false;
                this.is_square = false;
                this.is_mine = false;
                this.is_vote = false;
            }
        },
        prev() {
            this.is_content = false;
            this.is_welcome = true;
            this.is_rules = false;
            this.is_square = false;
            this.is_mine = false;
            this.is_vote = false;
            this.username_flag = false;
        },
        rules() {
            this.is_content = false;
            this.is_welcome = false;
            this.is_home = false;
            this.is_rules = true;
            this.is_square = false;
            this.is_mine = false;
            this.is_vote = false;
            this.username_flag = false;
        },
        square() {
            const self = this;
            self.is_content = false;
            self.is_welcome = false;
            self.is_home = false;
            self.is_rules = false;
            self.is_square = true;
            self.is_mine = false;
            self.is_vote = false;
            self.username_flag = false;
            const url = 'http://sf.avatars.vip/api/v1/articles';
            $.get(url, { 'per-page': 20 }, (data) => {
                self.squareList = data;
            });
        },
        mine() {
            const self = this;
            const flag = self.checkUser();
            if (!flag) {
                self.is_content = false;
                self.is_welcome = false;
                self.is_home = false;
                self.is_rules = false;
                self.is_square = false;
                self.is_mine = true;
                self.is_vote = false;
                const url = 'http://sf.avatars.vip/api/v1/articles';
                const username = self.username;
                $.get(url, { author: username, 'per-page': 100 }, (data) => {
                    self.mineList = data;
                });
            }
        },
        vote(id) {
            const flag = this.checkUser();
            const self = this;
            if (!flag) {
                this.is_content = false;
                this.is_welcome = false;
                this.is_home = false;
                this.is_rules = false;
                this.is_square = false;
                this.is_mine = false;
                this.is_vote = true;
                const url = `http://sf.avatars.vip/api/v1/articles/${id}`;
                $.get(url, (data) => {
                    self.voteData = data;
                });
            }

        },
        checkUser() {
            const username = localStorage.getItem('username');
            if (username === null) {
                this.username_flag = true;
            } else {
                this.username = username;
            }
            return this.username_flag;
        },
        submit() {
            const self = this;
            const url = 'http://sf.avatars.vip/api/v1/articles';
            const data = {
                title: self.promise_title,
                author: self.username,
                content: self.promise_extra,
                option1: self.promise_true,
                option2: self.promise_false,
                limit_time: Math.ceil(new Date(self.endTime).valueOf() / 1000),
            };
            $.post(url, data, () => {
                self.mine();
            });
        },
        makeVote(value) {
            const self = this;
            const username = self.username;
            const id = self.voteData.id;
            const url = `http://sf.avatars.vip/api/v1/articles/vote`;
            const data = {
                aid: id,
                author: username,
                option: value,
            };
            $.post(url, data, (res) => {
                self.vote(id);
            });
        },
    },
    beforeMount() {
    },
});