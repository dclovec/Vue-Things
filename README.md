# Vue-Things
something about vuejs

# 1、i18n.js，多语言插件
### 有缓存机制，必须手动注册。
    Vue.use(i18n, {
        isCache:true,//是否缓存语言包，默认为true
        getPack(lang, pack, callback) {
            //在这里处理获取语言包
            //lang为要获取的语言码，由vueInstance.$i18n.toggle传递
            //pack为已设置的语言包数据，初始化的值为空对象{}
            //callback为回调。没有传则代表需要返回Promise。第一个参数为数据，第二个参数为错误信息
            const data = { language: lang };
            (pack instanceof Array) ? pack.push(data) : (pack = [data]);
            if ('function' !== (typeof callback)) {
                return Promise.resolve(pack);
            } else {
                callback(pack, null);//数据，错误信息
            }
        }
    });
### 使用方式：vue实例及组件实例中，上下文为this.$i18n。
    this.$i18n.pack，为当前语言包，具有响应式特性。
    this.$i18n.current，为当前语言码，具有响应式特性。
    this.$i18n.toggle(language, callback?)，切换语言方法。callback为选填项，不传则会返回Promise。此callback与上面getPack中的callback有关系：此callback有值，getPack中的callback就有值，但不是同一个函数。调用此方法时，如果设置为要缓存结果，那么在内部，如果缓存池中没有此语言包，会调用上面的getPack方法获取并缓存起来，否则直接返回缓存的语言包；如果设置为不换存，会每次调用getPack方法。