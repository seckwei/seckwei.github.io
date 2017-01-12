let Thesaurus = {
    getSynonym(words) {
        let self = this;
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = self.readystatechange(resolve);
            xhr.open('GET', 'https://thesaurus-server.herokuapp.com/q?search='+words);
            xhr.send();
        });
    },
    readystatechange(callback) {
        return function() {
            if(this.readyState === 4 && this.status === 200) {
                callback(JSON.parse(this.responseText));
            }
        };
    }
};

let synonyms = document.querySelectorAll('[data-class=synonym]'),
    refresh = document.querySelector('#refresh'),
    words = Array.prototype.map.call(synonyms, element => element.textContent).join(',');

Thesaurus
    .getSynonym(words)
    .then(data => {
        data.forEach(obj => {
           document.querySelector(`#${obj.word}`).synonyms = obj.synonyms;
        });
        console.log('Synonyms loaded');
    });

refresh.onclick = function() {
    synonyms.forEach(element => {
        let wordSynonyms = element.synonyms;
        if(wordSynonyms){
            let max = wordSynonyms.length,
                rand = Math.floor(Math.random() * (max - 1));

            element.textContent = element.synonyms[rand];
        }
    });
};

let props = ['name', 'html_url', 'description'],
    username = 'seckwei';

let repoList = document.getElementById('repos');

GitHubAPI.fetchUserRepo(username, props)
    .then((repos) => {
        repos.forEach(repo => {
            let entry = document.createElement('LI'),
                title = document.createElement('A');
            title.textContent = repo.name;
            title.setAttribute('href', repo.html_url);
            title.setAttribute('target', '_blank');
            entry.appendChild(title);
            entry.appendChild(document.createElement('BR'));
            entry.appendChild(document.createTextNode(repo.description));
            repoList.appendChild(entry);
        });
    });