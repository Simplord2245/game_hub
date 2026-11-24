import { GameResponse, CategoryResponse } from '../models/catalog.model';
import { ProductResponse } from '../models/product.model';

export const INITIAL_GAMES: GameResponse[] = [
  {
    gameId: 1,
    gameName: 'Wuthering Waves',
    slug: 'wuthering-waves',
    publisher: 'Kuro Games',
    description: 'Game nhập vai thế giới mở hành động kịch tính với hệ thống chiến đấu mãn nhãn và đồ họa tuyệt đỉnh.',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80',
    gameStatus: 'ACTIVE',
    hot: true,
    orderCount: 15420
  },
  {
    gameId: 2,
    gameName: 'Genshin Impact',
    slug: 'genshin-impact',
    publisher: 'HoYoverse',
    description: 'Thế giới mở Teyvat kỳ diệu với 7 nguyên tố và hành trình tìm kiếm người thân thất lạc.',
    coverUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=160&auto=format&fit=crop&q=80',
    gameStatus: 'ACTIVE',
    hot: true,
    orderCount: 38900
  },
  {
    gameId: 3,
    gameName: 'Honkai: Star Rail',
    slug: 'honkai-star-rail',
    publisher: 'HoYoverse',
    description: 'Cuộc phiêu lưu giữa các vì sao trên chuyến tàu Astral Express với lối chơi chiến thuật theo lượt đỉnh cao.',
    coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=160&auto=format&fit=crop&q=80',
    gameStatus: 'ACTIVE',
    hot: true,
    orderCount: 22100
  },
  {
    gameId: 4,
    gameName: 'Zenless Zone Zero',
    slug: 'zenless-zone-zero',
    publisher: 'HoYoverse',
    description: 'Game hành động đô thị phong cách anime hiện đại, nhịp độ nhanh và nhạc điện tử cực cháy.',
    coverUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=160&auto=format&fit=crop&q=80',
    gameStatus: 'ACTIVE',
    hot: true,
    orderCount: 19800
  },
  {
    gameId: 5,
    gameName: 'Blue Archive',
    slug: 'blue-archive',
    publisher: 'Nexon',
    description: 'Thành phố học viện Kivotos với các nữ sinh dễ thương và những chiến dịch cứu rỗi thế giới.',
    coverUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=160&auto=format&fit=crop&q=80',
    gameStatus: 'ACTIVE',
    hot: false,
    orderCount: 8400
  },
  {
    gameId: 6,
    gameName: 'Arknights',
    slug: 'arknights',
    publisher: 'Yostar',
    description: 'Game thủ thành chiến thuật hấp dẫn với cốt truyện sâu sắc và dàn nhân vật đa dạng.',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=160&auto=format&fit=crop&q=80',
    gameStatus: 'ACTIVE',
    hot: false,
    orderCount: 6500
  },
  {
    gameId: 7,
    gameName: 'Brown Dust 2',
    slug: 'brown-dust-2',
    publisher: 'Neowiz',
    description: 'Game chiến thuật phiêu lưu đồ họa 2D retro cổ điển kết hợp hoạt họa Live2D quyến rũ.',
    coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=160&auto=format&fit=crop&q=80',
    gameStatus: 'ACTIVE',
    hot: false,
    orderCount: 4200
  },
  {
    gameId: 8,
    gameName: 'Fate/Grand Order',
    slug: 'fate-grand-order',
    publisher: 'Aniplex',
    description: 'Cuộc chiến Chén Thánh vĩ đại cùng các Anh Linh lịch sử qua các thời kỳ nhân loại.',
    coverUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=160&auto=format&fit=crop&q=80',
    gameStatus: 'ACTIVE',
    hot: false,
    orderCount: 9100
  }
];

export const INITIAL_CATEGORIES: CategoryResponse[] = [
  {
    categoryId: 1,
    categoryName: 'Tài Khoản Reroll / Khởi Đầu',
    slug: 'acc-reroll-khoi-dau',
    description: 'Tài khoản chứa lượng lớn ngọc, vé quay gacha và tài nguyên dồi dào, sẵn sàng bứt phá.',
    categoryStatus: 'ACTIVE',
    icon: '🎲'
  },
  {
    categoryId: 2,
    categoryName: 'Tài Khoản VIP / Endgame',
    slug: 'acc-vip-endgame',
    description: 'Tài khoản cấp cao, sở hữu nhiều nhân vật 5 sao giới hạn và vũ khí trấn phái mạnh mẽ.',
    categoryStatus: 'ACTIVE',
    icon: '👑'
  },
  {
    categoryId: 3,
    categoryName: 'Nạp Game Chiết Khấu',
    slug: 'nap-game-chiet-khau',
    description: 'Dịch vụ nạp gói đá quý, ngọc, tiền tệ trong game chính hãng với mức giá tiết kiệm 15% - 30%.',
    categoryStatus: 'ACTIVE',
    icon: '💎'
  },
  {
    categoryId: 4,
    categoryName: 'Thẻ Tháng & Battle Pass',
    slug: 'the-thang-battle-pass',
    description: 'Kích hoạt thẻ đặc quyền hằng ngày và huân chương chiến công giá siêu ưu đãi.',
    categoryStatus: 'ACTIVE',
    icon: '🎫'
  }
];

export const INITIAL_PRODUCTS: ProductResponse[] = [
  {
    productId: 1,
    productName: 'Acc Wuthering Waves · Jinhsi + Changli + Trấn Thần Thoại (Asia)',
    slug: 'acc-wuthering-waves-jinhsi-changli-tran-asia',
    sku: 'WW-ACC-001',
    productType: 'ACCOUNT',
    price: 350000,
    salePrice: 280000,
    description: 'Tài khoản Wuthering Waves Server Asia, Cấp độ Union Level 45+. Đã sở hữu Jinhsi C0R1 (có Trấn), Changli C0R1, Verina, Calcharo. Map mới khám phá 60%, còn nhiều tài nguyên.',
    coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80'
    ],
    game: INITIAL_GAMES[0],
    category: INITIAL_CATEGORIES[1],
    productStatus: 'ACTIVE',
    stockCount: 8,
    attributes: {
      server: 'Asia',
      platform: 'PC / Android / iOS',
      arLevel: 45,
      fiveStars: 5,
      characters: ['Jinhsi', 'Changli', 'Verina', 'Calcharo', 'Encore'],
      rerollGems: '4,500 Astrite + 15 Radiant Tide',
      instantDelivery: true,
      loginMethod: 'Kuro Account (Trắng thông tin, đổi mail ngay)',
      guarantee: 'Bảo hành vĩnh viễn không roll back'
    },
    createdAt: '2026-11-20T10:00:00Z'
  },
  {
    productId: 2,
    productName: 'Acc Reroll Wuthering Waves · 80+ Vé Quay + 8000+ Astrite (Asia)',
    slug: 'acc-reroll-wuthering-waves-80-ve-8000-astrite',
    sku: 'WW-REROLL-002',
    productType: 'ACCOUNT',
    price: 60000,
    salePrice: 45000,
    description: 'Tài khoản khởi đầu Wuthering Waves Server Asia. Chưa liên kết mail, nhận code ngay lập tức. Sẵn sàng gacha tướng mới.',
    coverUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80'],
    game: INITIAL_GAMES[0],
    category: INITIAL_CATEGORIES[0],
    productStatus: 'ACTIVE',
    stockCount: 45,
    attributes: {
      server: 'Asia',
      platform: 'Đa nền tảng',
      arLevel: 10,
      fiveStars: 0,
      rerollGems: '8,200 Astrite + 85 Vé Gacha',
      instantDelivery: true,
      loginMethod: 'Tài khoản trắng, tự điền email kích hoạt'
    },
    createdAt: '2026-11-21T14:30:00Z'
  },
  {
    productId: 3,
    productName: 'Acc Genshin Impact · Raiden Shogun + Nahida + Yelan AR 56 (Asia)',
    slug: 'acc-genshin-impact-raiden-nahida-yelan-ar56',
    sku: 'GI-ACC-003',
    productType: 'ACCOUNT',
    price: 650000,
    salePrice: 520000,
    description: 'Tài khoản Genshin Impact VIP cực đẹp: Raiden Shogun C2 + Lao Xiên Cá R5, Nahida C0, Yelan C0, Kazuha C0, Zhongli C0. Đầy đủ đồ chuẩn La Hoàn 36 sao nhẹ nhàng.',
    coverUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80'],
    game: INITIAL_GAMES[1],
    category: INITIAL_CATEGORIES[1],
    productStatus: 'ACTIVE',
    stockCount: 3,
    attributes: {
      server: 'Asia',
      platform: 'PC / Mobile / PS5',
      arLevel: 56,
      fiveStars: 11,
      characters: ['Raiden Shogun (C2)', 'Nahida', 'Yelan', 'Kaedehara Kazuha', 'Zhongli', 'Furina'],
      rerollGems: '3,800 Nguyên Thạch',
      instantDelivery: true,
      loginMethod: 'HoYoverse ID (Hỗ trợ đổi sạch mail & số điện thoại)',
      guarantee: 'Bảo hành 1 đổi 1 trong 30 ngày nếu có lỗi'
    },
    createdAt: '2026-11-19T09:15:00Z'
  },
  {
    productId: 4,
    productName: 'Acc Reroll Genshin Impact · 25,000+ Nguyên Thạch + 50 Mối Duyên (Asia)',
    slug: 'acc-reroll-genshin-impact-25000-nguyen-thach',
    sku: 'GI-REROLL-004',
    productType: 'ACCOUNT',
    price: 90000,
    salePrice: 70000,
    description: 'Kho nguyên thạch khổng lồ cho anh em rước waifu / husbando yêu thích. Sinh nhật chưa set, nhiệm vụ chưa làm, tha hồ cày cuốc.',
    coverUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80'],
    game: INITIAL_GAMES[1],
    category: INITIAL_CATEGORIES[0],
    productStatus: 'ACTIVE',
    stockCount: 80,
    attributes: {
      server: 'Asia',
      platform: 'Tất cả nền tảng',
      arLevel: 10,
      fiveStars: 0,
      rerollGems: '26,500 Nguyên Thạch + 55 Mối Duyên Vương Vấn',
      instantDelivery: true,
      loginMethod: 'Username / Password sạch'
    },
    createdAt: '2026-11-22T11:00:00Z'
  },
  {
    productId: 5,
    productName: 'Acc Honkai Star Rail · Acheron + Firefly + Ruan Mei Cấp 65 (Asia)',
    slug: 'acc-honkai-star-rail-acheron-firefly-ruan-mei',
    sku: 'HSR-ACC-005',
    productType: 'ACCOUNT',
    price: 490000,
    salePrice: 390000,
    description: 'Đội hình Siêu Kích Phá và Siêu Sát Thương Hư Vô hủy diệt Sảnh Đường Hỗn Độn. Firefly C0R1, Acheron C0R1, Ruan Mei, Gallagher E6.',
    coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80'],
    game: INITIAL_GAMES[2],
    category: INITIAL_CATEGORIES[1],
    productStatus: 'ACTIVE',
    stockCount: 5,
    attributes: {
      server: 'Asia',
      platform: 'PC / Mobile',
      arLevel: 65,
      fiveStars: 8,
      characters: ['Acheron', 'Firefly', 'Ruan Mei', 'Black Swan', 'Bronya'],
      instantDelivery: true,
      loginMethod: 'HoYoverse sạch'
    },
    createdAt: '2026-11-22T08:00:00Z'
  },
  {
    productId: 6,
    productName: 'Acc Zenless Zone Zero · Ellen Joe + Zhu Yuan + Jane Doe (Asia)',
    slug: 'acc-zenless-zone-zero-ellen-joe-zhu-yuan-jane-doe',
    sku: 'ZZZ-ACC-006',
    productType: 'ACCOUNT',
    price: 420000,
    salePrice: 340000,
    description: 'Acc khởi đầu đẳng cấp ZZZ sở hữu bộ 3 limited hot nhất: Cá mập Ellen Joe, Nữ cảnh sát Zhu Yuan và Chuột Jane Doe.',
    coverUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80'],
    game: INITIAL_GAMES[3],
    category: INITIAL_CATEGORIES[1],
    productStatus: 'ACTIVE',
    stockCount: 6,
    attributes: {
      server: 'Asia',
      platform: 'PC / iOS / Android',
      arLevel: 42,
      fiveStars: 6,
      characters: ['Ellen Joe', 'Zhu Yuan', 'Jane Doe', 'Lycaon', 'Grace'],
      instantDelivery: true,
      loginMethod: 'Đổi mail ngay'
    },
    createdAt: '2026-11-23T15:20:00Z'
  },
  {
    productId: 7,
    productName: 'Gói Thẻ Tháng Không Nguyệt Genshin Impact (Nạp Thẳng UID)',
    slug: 'the-thang-khong-nguyet-genshin-impact',
    sku: 'GI-PASS-007',
    productType: 'PASS',
    price: 110000,
    salePrice: 95000,
    description: 'Nhận ngay 300 Đá Sáng Thế và 90 Nguyên Thạch mỗi ngày trong 30 ngày (tổng 3,000 Nguyên Thạch). Chỉ cần cung cấp UID và Server, không cần mật khẩu.',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'],
    game: INITIAL_GAMES[1],
    category: INITIAL_CATEGORIES[3],
    productStatus: 'ACTIVE',
    stockCount: 999,
    attributes: {
      server: 'Mọi Server',
      platform: 'Tất cả thiết bị',
      instantDelivery: true,
      loginMethod: 'Chỉ cần UID + Server'
    },
    createdAt: '2026-11-20T12:00:00Z'
  },
  {
    productId: 8,
    productName: 'Acc Reroll Blue Archive · 40,000+ Pyroxene + Nhiều Vé 3 Sao (Global)',
    slug: 'acc-reroll-blue-archive-40000-pyroxene-global',
    sku: 'BA-REROLL-008',
    productType: 'ACCOUNT',
    price: 85000,
    salePrice: 65000,
    description: 'Acc Reroll Blue Archive Global chứa hơn 40.000 Pyroxene (hơn 300 lượt roll), sẵn sàng gacha full nhân vật Fes giới hạn.',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80'],
    game: INITIAL_GAMES[4],
    category: INITIAL_CATEGORIES[0],
    productStatus: 'ACTIVE',
    stockCount: 30,
    attributes: {
      server: 'Global',
      platform: 'Android / iOS',
      rerollGems: '42,000 Pyroxene + 2 Vé 10 Roll',
      instantDelivery: true,
      loginMethod: 'Code liên kết Yostar'
    },
    createdAt: '2026-11-21T09:00:00Z'
  }
];
