/* Bản xem trước giao diện cho GitHub Pages. Dữ liệu dưới đây chỉ là minh họa.
   Không có backend, đăng nhập, thanh toán hoặc giao key thật. */
(() => {
  const categories = [
    {id:1, name:'Menu Key', slug:'menu-key', description:'Key và tiện ích số'},
    {id:2, name:'Acc Clone', slug:'acc-clone', description:'Tài khoản clone'},
    {id:3, name:'Acc Game', slug:'acc-game', description:'Tài khoản trò chơi'},
    {id:4, name:'Sản phẩm khác', slug:'san-pham-khac', description:'Tiện ích kỹ thuật số'}
  ];
  const products = [
    {id:1, slug:'key-premium-30-ngay', name:'Key Premium — 30 ngày', summary:'Gói trải nghiệm 30 ngày. Nội dung minh họa cho giao diện.', description:'Đây là sản phẩm demo để xem bố cục chi tiết sản phẩm.', category:categories[0], min_price_vnd:59000, available:true, image_url:'', variants:[{id:101,name:'30 ngày',duration_label:'30 ngày',price_vnd:59000,available:true,stock:12},{id:102,name:'90 ngày',duration_label:'90 ngày',price_vnd:149000,available:true,stock:5}], instructions:'Hướng dẫn sử dụng sẽ hiển thị tại đây sau khi cửa hàng cấu hình.'},
    {id:2, slug:'key-basic-7-ngay', name:'Key Basic — 7 ngày', summary:'Gói cơ bản ngắn hạn, thông tin và giá chỉ là minh họa.', description:'Bản demo giao diện cửa hàng nminhios store.', category:categories[0], min_price_vnd:19000, available:true, image_url:'', variants:[{id:201,name:'7 ngày',duration_label:'7 ngày',price_vnd:19000,available:true,stock:20}], instructions:'Thông tin hướng dẫn sử dụng mẫu.'},
    {id:3, slug:'acc-clone-starter', name:'Acc Clone — Starter', summary:'Tài khoản mẫu với mô tả ngắn gọn, dễ xem trên điện thoại.', description:'Tài khoản mẫu dùng để trình bày giao diện, không phải tài khoản bán thật.', category:categories[1], min_price_vnd:25000, available:true, image_url:'', variants:[{id:301,name:'Starter',duration_label:'Giao tài khoản',price_vnd:25000,available:true,stock:8}], instructions:'Thông tin bàn giao sẽ hiển thị tại đây.'},
    {id:4, slug:'acc-game-adventure', name:'Acc Game — Adventure', summary:'Mẫu thẻ tài khoản game với trạng thái kho rõ ràng.', description:'Nội dung minh họa, không đại diện cho hàng hóa có sẵn.', category:categories[2], min_price_vnd:89000, available:true, image_url:'', variants:[{id:401,name:'Gói tiêu chuẩn',duration_label:'Giao tài khoản',price_vnd:89000,available:true,stock:3}], instructions:'Hướng dẫn nhận và sử dụng tài khoản.'},
    {id:5, slug:'digital-tool-kit', name:'Digital Tool Kit', summary:'Tiện ích kỹ thuật số, giá minh họa cho bản xem trước.', description:'Sản phẩm demo để kiểm tra cách hiển thị danh mục khác.', category:categories[3], min_price_vnd:39000, available:true, image_url:'', variants:[{id:501,name:'Bản tiêu chuẩn',duration_label:'Vĩnh viễn',price_vnd:39000,available:true,stock:15}], instructions:'Hướng dẫn sử dụng mẫu.'},
    {id:6, slug:'key-pro-lifetime', name:'Key Pro — Vĩnh viễn', summary:'Thẻ sản phẩm có lựa chọn thời hạn vĩnh viễn.', description:'Dữ liệu giả lập để xem giao diện. Không có key được giao.', category:categories[0], min_price_vnd:299000, available:false, image_url:'', variants:[{id:601,name:'Vĩnh viễn',duration_label:'Vĩnh viễn',price_vnd:299000,available:false,stock:0}], instructions:'Sản phẩm minh họa đang hết hàng.'}
  ];
  const json = (data, status=200) => new Response(JSON.stringify(data), {status, headers:{'Content-Type':'application/json'}});
  const nativeFetch = window.fetch.bind(window);
  window.fetch = async (input, init={}) => {
    const url = new URL(typeof input === 'string' ? input : input.url, location.href);
    if (!url.pathname.includes('/api/')) return nativeFetch(input, init);
    const path = url.pathname.slice(url.pathname.indexOf('/api/'));
    if (path === '/api/me') return json({user:null,csrf_token:null});
    if (path === '/api/store') return json({demo_mode:true,banner_title:'Không gian sản phẩm số',banner_description:'Khám phá key, tài khoản và tiện ích số — thông tin minh bạch, giao hàng theo đúng trạng thái đơn.',support_email:'',payment_instructions:'Đây là bản xem trước giao diện. Thanh toán chưa được kết nối.'});
    if (path === '/api/categories') return json(categories);
    if (path === '/api/products' || path.startsWith('/api/products?')) {
      const q=(url.searchParams.get('q')||'').toLowerCase(), cat=url.searchParams.get('category')||'', sort=url.searchParams.get('sort')||'featured';
      let items=products.filter(p=>(!q || (p.name+' '+p.summary).toLowerCase().includes(q)) && (!cat || p.category.slug===cat));
      if(sort==='price') items.sort((a,b)=>a.min_price_vnd-b.min_price_vnd); if(sort==='name') items.sort((a,b)=>a.name.localeCompare(b.name,'vi'));
      const page=Math.max(1,Number(url.searchParams.get('page')||1)), limit=Math.max(1,Number(url.searchParams.get('limit')||12)), total=items.length;
      return json({items:items.slice((page-1)*limit,page*limit),total,pages:Math.max(1,Math.ceil(total/limit)),page});
    }
    if (path.startsWith('/api/products/')) { const slug=decodeURIComponent(path.slice('/api/products/'.length)); const p=products.find(x=>x.slug===slug); return p?json(p):json({error:'Không tìm thấy sản phẩm demo.'},404); }
    if (path === '/api/orders') return json([]);
    if (path.startsWith('/api/orders/')) return json({error:'Đơn hàng không khả dụng trong bản xem trước.'},404);
    if (path === '/api/logout') return json({ok:true,user:null});
    if (path === '/api/coupons/validate') return json({error:'Mã giảm giá chỉ khả dụng khi kết nối backend.'},400);
    if (path === '/api/checkout') return json({error:'Bản xem trước không xử lý đơn hàng hoặc thanh toán thật.'},400);
    if (path === '/api/profile') return json({error:'Tài khoản chưa được kết nối trong bản xem trước.'},400);
    return json({error:'Chức năng này chỉ có trong bản backend đầy đủ.'},501);
  };
})();
