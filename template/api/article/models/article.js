'use strict';
const { isDraft } = require('strapi-utils').contentTypes;

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    async afterUpdate(updatedArticle) {

      if (updatedArticle.published_at == null) {
        console.log("isDraft")
      } else {
        console.log("!isDraft")
        const publinfo = await strapi.query('publinfo').findOne();

        console.log(JSON.stringify({
          article: {
            title: updatedArticle.title,
            description: updatedArticle.description,
            content: updatedArticle.content,
            slug: updatedArticle.slug,
            category: updatedArticle.category,
            author: updatedArticle.author,
            published_at: updatedArticle.published_at,
            created_at: updatedArticle.created_at
          },
          publinfo: {
            name: publinfo.name,
            slug: publinfo.slug,
            fqdn: publinfo.fqdn,
            department: publinfo.department,
            template: publinfo.template,
          },
        }))
      }
    },
  },
};
