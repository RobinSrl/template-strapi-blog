'use strict';
const axios = require('axios');
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    async afterCreate(article) {
      const slugIdPatternRegex = /-\d+\.\d+?$/
      const slugContainsId = slugIdPatternRegex.test(article.slug)
      console.log(slugContainsId)
      if (!slugContainsId) {
        const publinfo = await strapi.query('publinfo').findOne();
        article.slug = article.slug + "-" + publinfo.idPublication + "." + article.id
      }
      console.log(article)
      await strapi.services.article.update({ id: article.id }, article)
    },
    async afterUpdate(updatedArticle) {

      if (updatedArticle.published_at == null) {
        console.log("isDraft")
      } else {
        console.log("!isDraft")
        const publinfo = await strapi.query('publinfo').findOne();

        const result = {
          article: {
            title: updatedArticle.title,
            description: updatedArticle.description,
            content: updatedArticle.content,
            slug: updatedArticle.slug,
            category: updatedArticle.categories,
            subject: updatedArticle.subjects,
            author: updatedArticle.authors,
            image: updatedArticle.image,
            gallery: updatedArticle.gallery,
            published_at: updatedArticle.published_at,
            created_at: updatedArticle.created_at,
            link: "https://" + publinfo.fqdn + "/" + updatedArticle.slug,
            guid: "https://" + publinfo.fqdn + "/" + updatedArticle.slug,
            objectID: "https://" + publinfo.fqdn + "/" + updatedArticle.slug,
            partners_id: updatedArticle.slug.match(/\d+\.\d+?$/) || null,
            comments: true,
            type: "article",
            unixtimestamp: Date.now()
          },
          publinfo: {
            name: publinfo.name,
            slug: publinfo.slug,
            fqdn: publinfo.fqdn,
            departament: publinfo.properties.algolia.departament,
            site: publinfo.properties.algolia.site,
            edition: publinfo.properties.algolia.edition,
            idPublication: publinfo.idPublication,
            template: publinfo.template,
            source: publinfo.source,

          },
          method: "strapi-write"
        }
        console.log(JSON.stringify(result))

        let axiosConfig = {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
            "Connection": "keep-alive",
          }
        }
        const r = await axios.post(process.env.POLPLEXER_URL, JSON.stringify(result), axiosConfig)
        console.log(r.data)
      }
    },
    async beforeDelete(params) {

      const art = await strapi.services.article.findOne(params)
      const publinfo = await strapi.query('publinfo').findOne();

      console.log(art)
      const result = {
        method: "strapi-delete",
        parameters: {
          guid: "https://" + publinfo.fqdn + "/" + art.slug,
        }
      }

      let axiosConfig = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*",
          "Connection": "keep-alive",
        }
      }
      const r = await axios.post(process.env.POLPLEXER_URL, JSON.stringify(result), axiosConfig)
      console.log(r.data)
    }
  },
};
