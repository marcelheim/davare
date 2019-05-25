const fetch = require('node-fetch');

module.exports = {
     getReddit: async function(args){
        let data = undefined;
        await fetch(`https://www.reddit.com/r/${args.subreddit}/${args.sortby}/.json?limit=100`)
        .then((res) => {
            if (res.ok) return res;
            else return Promise.reject(new Error("Reddit - 404"));
        })
        .then(res => res.json())
        .then(function (res) {
            if (res.data.children.length > 0) return res;
            else return Promise.reject(new Error("Reddit - No Data"))
        })
        .then(res => res.data.children)
        .then(res => res.map(post => ({
            author: post.data.author,
            link: post.data.url,
            title: post.data.title,
            subreddit: post.data.subreddit,
            post_hint: post.data.post_hint
        })))
        .then(res => res.filter(a => a.post_hint === "image"))
        .then((res) => {
            data = res;
        })
        .catch(error => {
            console.log(error);
            data = undefined;
        });
        return data;
    }
};