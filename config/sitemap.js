import axios from "axios";
const sitemap = {
  path: '/sitemap.xml', //生成的文件路径
    hostname: 'https://lolitalibrary.com/', //网站的网址
    cacheTime: 1000 * 60 * 60 * 24, //一天的更新频率，只在generate:false有用
    gzip: true, //生成.xml.gz的sitemap
    generate: false,
    exclude: ['/404', '/apiLolita', '/login', '/register'], //排除不要的页面，这里的路径是相对于hostname
    defaults: {
      changefred: 'always',
      lastmod: new Date()
    },

    routes: async () => {
      const { data } = await axios.get('https://lolitalibrary.com/apiLolita/getSiteMap.php')
      const routes = [
        {
          url: '/',
          changefreq: 'always',
          lastmod: new Date()
        },
        {
          url: '/library',
          changefreq: 'always',
          lastmod: new Date()
        },
        {
          url: '/shop',
          changefreq: 'always',
          lastmod: new Date()
        },
        {
          url: '/community',
          changefreq: 'always',
          lastmod: new Date()
        }
      ]
      if (data) {
        let library = data.library.map(item => ({
            url: "/library/detail/" + item.library_id,
            lastmod: item.date,
            changefreq: "yearly"
        }))
        let shop = data.shop.map(item => ({
            url: "/shop/detail/" + item.shop_id,
            lastmod: item.create_time,
            changefreq: "yearly"
        }))
        routes.push(...library)
        routes.push(...shop)
      }
      return routes
    }
}
export default sitemap
