
export default {
    installed: false,
    install(Vue, options) {
        if (this.installed) {
            return;
        }
        this.installed = true;

        options.isCache = !options.hasOwnProperty('isCache') ? true : !!options.isCache;

        const i18n = new Vue({
            data:{
                currentLanguage:null,
                pack:{}
            }
        });

        const languagePacks = {};

        function toggleLanguage(language, callback) {
            if (options.isCache && languagePacks.hasOwnProperty(i18n.currentLanguage = language)) {
                if ('function' !== (typeof callback)) {
                    return Promise.resolve(i18n.pack = languagePacks[language]);
                } else {
                    callback(i18n.pack = languagePacks[language] || {});
                }
            } else {
                if ('function' !== (typeof callback)) {
                    return options.getPack(language, i18n.pack).then(function(pack){
                        i18n.pack = pack;
                        options.isCache && (languagePacks[language] = pack);
                        return pack;
                    });
                } else {
                    options.getPack(language, i18n.pack, function (pack, err) {
                        i18n.pack = pack;
                        options.isCache && (languagePacks[language] = pack);
                        callback(pack, err);
                    });
                }
            }
        }

        const $i18n = {};
        Object.defineProperties($i18n, {
            current: {
                enumerable: false,
                get() {
                    return i18n.currentLanguage;
                }
            },
            pack: {
                enumerable: false,
                get() {
                    return i18n.pack;
                }
            },
            toggle: {
                enumerable: false,
                get() {
                    return toggleLanguage;
                }
            }
        });
        Object.defineProperty(Vue.prototype, '$i18n', {
            enumerable: false,
            get() {
                return $i18n;
            }
        });

        window.addEventListener('beforeunload', function () {
            for (let key in $i18n) {
                if ($i18n.hasOwnProperty(key)) {
                    delete $i18n[key];
                }
            }

            i18n.$destroy();

            for (let key in languagePacks) {
                if (languagePacks.hasOwnProperty(key)) {
                    delete languagePacks[key];
                }
            }
        });

    }
}