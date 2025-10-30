document.addEventListener('DOMContentLoaded', () => {
    // Open-Meteo API는 무료이며 API 키가 필요하지 않습니다.
    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('search-weather-btn');
    const currentLocationBtn = document.getElementById('current-location-btn');
    const currentWeatherDiv = document.getElementById('current-weather');
    const forecastDiv = document.getElementById('forecast');

    const ICONS = {
        clear: 'assets/images/weather/clear.svg',
        partly: 'assets/images/weather/partly.svg',
        cloudy: 'assets/images/weather/cloudy.svg',
        rain: 'assets/images/weather/rain.svg',
        snow: 'assets/images/weather/snow.svg',
        storm: 'assets/images/weather/storm.svg',
        fog: 'assets/images/weather/fog.svg'
    };

    const weatherDescriptionMap = {
        0: '맑음',
        1: '대체로 맑음',
        2: '부분적으로 흐림',
        3: '흐림',
        45: '안개',
        48: '서리 낀 안개',
        51: '약한 이슬비',
        53: '중간 이슬비',
        55: '강한 이슬비',
        56: '약한 얼어붙는 이슬비',
        57: '강한 얼어붙는 이슬비',
        61: '약한 비',
        63: '중간 비',
        65: '강한 비',
        66: '약한 얼음비',
        67: '강한 얼음비',
        71: '약한 눈',
        73: '중간 눈',
        75: '강한 눈',
        77: '눈송이',
        80: '가벼운 소나기',
        81: '중간 소나기',
        82: '강한 소나기',
        85: '가벼운 눈 소나기',
        86: '강한 눈 소나기',
        95: '뇌우',
        96: '약한 우박을 동반한 뇌우',
        99: '강한 우박을 동반한 뇌우'
    };

    // 한글 -> 영어 지명 변환 맵 (전세계 주요 도시)
    const koreanToEnglishMap = {
        // === 대한민국 ===
        // 서울특별시 (구 단위)
        '서울': 'Seoul',
        '강남': 'Gangnam',
        '강남구': 'Gangnam-gu',
        '강동': 'Gangdong',
        '강동구': 'Gangdong-gu',
        '강북': 'Gangbuk',
        '강북구': 'Gangbuk-gu',
        '강서': 'Gangseo',
        '강서구': 'Gangseo-gu',
        '관악': 'Gwanak',
        '관악구': 'Gwanak-gu',
        '광진': 'Gwangjin',
        '광진구': 'Gwangjin-gu',
        '구로': 'Guro',
        '구로구': 'Guro-gu',
        '금천': 'Geumcheon',
        '금천구': 'Geumcheon-gu',
        '노원': 'Nowon',
        '노원구': 'Nowon-gu',
        '도봉': 'Dobong',
        '도봉구': 'Dobong-gu',
        '동대문': 'Dongdaemun',
        '동대문구': 'Dongdaemun-gu',
        '동작': 'Dongjak',
        '동작구': 'Dongjak-gu',
        '마포': 'Mapo',
        '마포구': 'Mapo-gu',
        '서대문': 'Seodaemun',
        '서대문구': 'Seodaemun-gu',
        '서초': 'Seocho',
        '서초구': 'Seocho-gu',
        '성동': 'Seongdong',
        '성동구': 'Seongdong-gu',
        '성북': 'Seongbuk',
        '성북구': 'Seongbuk-gu',
        '송파': 'Songpa',
        '송파구': 'Songpa-gu',
        '양천': 'Yangcheon',
        '양천구': 'Yangcheon-gu',
        '영등포': 'Yeongdeungpo',
        '영등포구': 'Yeongdeungpo-gu',
        '용산': 'Yongsan',
        '용산구': 'Yongsan-gu',
        '은평': 'Eunpyeong',
        '은평구': 'Eunpyeong-gu',
        '종로': 'Jongno',
        '종로구': 'Jongno-gu',
        '중': 'Jung',
        '중구': 'Jung-gu',
        
        // 서울 주요 동 단위
        '역삼동': 'Yeoksam-dong',
        '삼성동': 'Samseong-dong',
        '논현동': 'Nonhyeon-dong',
        '청담동': 'Cheongdam-dong',
        '압구정동': 'Apgujeong-dong',
        '신사동': 'Sinsa-dong',
        '서초동': 'Seocho-dong',
        '반포동': 'Banpo-dong',
        '잠실동': 'Jamsil-dong',
        '천호동': 'Cheonho-dong',
        '명동': 'Myeong-dong',
        '이태원동': 'Itaewon-dong',
        '한남동': 'Hannam-dong',
        '이촌동': 'Ichon-dong',
        '여의도동': 'Yeouido-dong',
        '당산동': 'Dangsan-dong',
        '홍대': 'Hongdae',
        '상수동': 'Sangsu-dong',
        '합정동': 'Hapjeong-dong',
        '연남동': 'Yeonnam-dong',
        '신촌동': 'Sinchon-dong',
        '광화문': 'Gwanghwamun',
        '종로': 'Jongno',
        '을지로': 'Euljiro',
        '충무로': 'Chungmuro',
        '남대문': 'Namdaemun',
        '동대문': 'Dongdaemun',
        '혜화동': 'Hyehwa-dong',
        '대학로': 'Daehangno',
        '성북동': 'Seongbuk-dong',
        '평창동': 'Pyeongchang-dong',
        '구기동': 'Gugi-dong',
        '부암동': 'Buam-dong',
        '북촌': 'Bukchon',
        '인사동': 'Insadong',
        '삼청동': 'Samcheong-dong',
        '가회동': 'Gahoe-dong',
        '성수동': 'Seongsu-dong',
        '왕십리': 'Wangsimni',
        '건대입구': 'Konkuk University',
        '군자동': 'Gunja-dong',
        '중곡동': 'Junggok-dong',
        '신림동': 'Sillim-dong',
        '봉천동': 'Bongcheon-dong',
        '사당동': 'Sadang-dong',
        '방배동': 'Bangbae-dong',
        '노량진': 'Noryangjin',
        '대림동': 'Daerim-dong',
        '구로동': 'Guro-dong',
        '가산동': 'Gasan-dong',
        '독산동': 'Doksan-dong',
        '상계동': 'Sanggye-dong',
        '중계동': 'Junggye-dong',
        '공릉동': 'Gongneung-dong',
        '하계동': 'Hagye-dong',
        '수유동': 'Suyu-dong',
        '미아동': 'Mia-dong',
        '번동': 'Beon-dong',
        '창동': 'Chang-dong',
        '도봉동': 'Dobong-dong',
        '쌍문동': 'Ssangmun-dong',
        '방학동': 'Banghak-dong',
        '석계동': 'Seokgye-dong',
        '태릉': 'Taereung',
        '공덕동': 'Gongdeok-dong',
        '아현동': 'Ahyeon-dong',
        '신수동': 'Sinsu-dong',
        '연희동': 'Yeonhui-dong',
        '북아현동': 'Bugahyeon-dong',
        '천연동': 'Cheonyeon-dong',
        '신정동': 'Sinjeong-dong',
        '목동': 'Mok-dong',
        '화곡동': 'Hwagok-dong',
        '염창동': 'Yeomchang-dong',
        '등촌동': 'Deungchon-dong',
        '개봉동': 'Gaebong-dong',
        '오류동': 'Oryu-dong',
        '천왕동': 'Cheonwang-dong',
        
        // 인천광역시
        '인천': 'Incheon',
        '부평': 'Bupyeong',
        '송도': 'Songdo',
        '계양': 'Gyeyang',
        '남동': 'Namdong',
        '연수': 'Yeonsu',
        
        // 인천 주요 동 단위
        '송도동': 'Songdo-dong',
        '연수동': 'Yeonsu-dong',
        '청라동': 'Cheongna-dong',
        '영종도': 'Yeongjongdo',
        '구월동': 'Guwol-dong',
        '간석동': 'Ganseok-dong',
        '만수동': 'Mansu-dong',
        '작전동': 'Jakjeon-dong',
        '계산동': 'Gyesan-dong',
        '효성동': 'Hyoseong-dong',
        '주안동': 'Juan-dong',
        '관교동': 'Gwangyo-dong',
        
        // 경기도 주요 도시
        '수원': 'Suwon',
        '성남': 'Seongnam',
        '분당': 'Bundang',
        '용인': 'Yongin',
        '고양': 'Goyang',
        '일산': 'Ilsan',
        '화성': 'Hwaseong',
        '부천': 'Bucheon',
        '안산': 'Ansan',
        '남양주': 'Namyangju',
        '안양': 'Anyang',
        '평택': 'Pyeongtaek',
        '시흥': 'Siheung',
        '파주': 'Paju',
        '의정부': 'Uijeongbu',
        '김포': 'Gimpo',
        '광주': 'Gwangju',
        '광명': 'Gwangmyeong',
        '군포': 'Gunpo',
        '하남': 'Hanam',
        '오산': 'Osan',
        '양주': 'Yangju',
        '이천': 'Icheon',
        '구리': 'Guri',
        '안성': 'Anseong',
        '포천': 'Pocheon',
        '의왕': 'Uiwang',
        '여주': 'Yeoju',
        '동두천': 'Dongducheon',
        '과천': 'Gwacheon',
        '가평': 'Gapyeong',
        '양평': 'Yangpyeong',
        '연천': 'Yeoncheon',
        
        // 경기도 주요 동/읍/면 단위
        '분당구': 'Bundang-gu',
        '판교': 'Pangyo',
        '판교동': 'Pangyo-dong',
        '정자동': 'Jeongja-dong',
        '서현동': 'Seohyeon-dong',
        '수내동': 'Sunae-dong',
        '야탑동': 'Yatap-dong',
        '이매동': 'Imae-dong',
        '백현동': 'Baekhyeon-dong',
        '삼평동': 'Sampyeong-dong',
        '광교': 'Gwanggyo',
        '광교동': 'Gwanggyo-dong',
        '영통': 'Yeongtong',
        '영통동': 'Yeongtong-dong',
        '매탄동': 'Maetan-dong',
        '인계동': 'Ingye-dong',
        '팔달': 'Paldal',
        '수원역': 'Suwon Station',
        '수원시청': 'Suwon City Hall',
        '일산동구': 'Ilsandong-gu',
        '일산서구': 'Ilsanseo-gu',
        '정발산동': 'Jeongbalsan-dong',
        '주엽동': 'Juyeop-dong',
        '탄현동': 'Tanhyeon-dong',
        '대화동': 'Daehwa-dong',
        '킨텍스': 'KINTEX',
        '백석동': 'Baekseok-dong',
        '마두동': 'Madu-dong',
        '덕양': 'Deokyang',
        '행신동': 'Haengsin-dong',
        '능곡동': 'Neunggok-dong',
        '원당동': 'Wondang-dong',
        '처인구': 'Cheoin-gu',
        '기흥구': 'Giheung-gu',
        '수지구': 'Suji-gu',
        '죽전': 'Jukjeon',
        '죽전동': 'Jukjeon-dong',
        '보정동': 'Bojeong-dong',
        '동백': 'Dongbaek',
        '동백동': 'Dongbaek-dong',
        '구성동': 'Guseong-dong',
        '상현동': 'Sanghyeon-dong',
        '에버랜드': 'Everland',
        '부천시청': 'Bucheon City Hall',
        '중동': 'Jung-dong',
        '상동': 'Sang-dong',
        '송내': 'Songnae',
        '소사': 'Sosa',
        '역곡': 'Yeokgok',
        '고잔동': 'Gojan-dong',
        '중앙동': 'Jungang-dong',
        '원곡동': 'Wongok-dong',
        '단원구': 'Danwon-gu',
        '상록구': 'Sangrok-gu',
        '안양시청': 'Anyang City Hall',
        '평촌': 'Pyeongchon',
        '범계': 'Beomgye',
        '인덕원': 'Indeogwon',
        '비산동': 'Bisan-dong',
        '송탄': 'Songtan',
        '안중': 'Anjung',
        '팽성': 'Paengseong',
        '운정': 'Unjeong',
        '운정동': 'Unjeong-dong',
        '금촌': 'Geumchon',
        '교하': 'Gyoha',
        '헤이리': 'Heyri',
        '통진': 'Tongjin',
        '월곶': 'Wolgot',
        '김포공항': 'Gimpo Airport',
        '장흥': 'Jangheung',
        '미사': 'Misa',
        '풍무동': 'Pungmu-dong',
        '남양주시청': 'Namyangju City Hall',
        '다산': 'Dasan',
        '다산동': 'Dasan-dong',
        '별내': 'Byeollae',
        '별내동': 'Byeollae-dong',
        '화도': 'Hwado',
        '평내': 'Pyeongnae',
        '호평': 'Hopyeong',
        '진접': 'Jinjeop',
        '오남': 'Onam',
        '광주시청': 'Gwangju City Hall',
        '경안동': 'Gyeongan-dong',
        '오포': 'Opo',
        '초월': 'Chowol',
        '곤지암': 'Gonjiam',
        '동탄': 'Dongtan',
        '동탄1동': 'Dongtan 1-dong',
        '동탄2동': 'Dongtan 2-dong',
        '병점': 'Byeongjeom',
        '향남': 'Hyangnam',
        '남양': 'Namyang',
        '우정': 'Ujeong',
        '구리시청': 'Guri City Hall',
        '교문동': 'Gyomun-dong',
        '인창동': 'Inchang-dong',
        '토평동': 'Topyeong-dong',
        '하남시청': 'Hanam City Hall',
        '미사강변': 'Misa Riverside',
        '감일동': 'Gamil-dong',
        '춘궁동': 'Chungung-dong',
        '덕풍동': 'Deokpung-dong',
        '신장동': 'Sinjang-dong',
        
        // 부산광역시
        '부산': 'Busan',
        '해운대': 'Haeundae',
        '사하': 'Saha',
        '동래': 'Dongnae',
        '남구': 'Nam-gu',
        '북구': 'Buk-gu',
        '사상': 'Sasang',
        '금정': 'Geumjeong',
        '기장': 'Gijang',
        '연제': 'Yeonje',
        '수영': 'Suyeong',
        
        // 부산 주요 동 단위
        '해운대구': 'Haeundae-gu',
        '중동부산': 'Jung-dong',
        '우동': 'U-dong',
        '좌동': 'Jwa-dong',
        '송정': 'Songjeong',
        '송정동': 'Songjeong-dong',
        '기장군': 'Gijang-gun',
        '일광': 'Ilgwang',
        '장안': 'Jangan',
        '광안': 'Gwangan',
        '광안동': 'Gwangan-dong',
        '남천동': 'Namcheon-dong',
        '민락동': 'Millak-dong',
        '수영구청': 'Suyeong-gu Office',
        '센텀시티': 'Centum City',
        '재송동': 'Jaesong-dong',
        '거제동': 'Geoje-dong',
        '연산동': 'Yeonsan-dong',
        '서면': 'Seomyeon',
        '전포동': 'Jeonpo-dong',
        '부전동': 'Bujeon-dong',
        '범천동': 'Beomcheon-dong',
        '온천동': 'Oncheon-dong',
        '명륜동': 'Myeongnyun-dong',
        '온천장': 'Oncheonjang',
        '사직동': 'Sajik-dong',
        '범일동': 'Beomil-dong',
        '초량동': 'Choryang-dong',
        '부산역': 'Busan Station',
        '남포동': 'Nampo-dong',
        '자갈치': 'Jagalchi',
        '광복동': 'Gwangbok-dong',
        '국제시장': 'Gukje Market',
        '부산진': 'Busanjin',
        '양정': 'Yangjeong',
        '덕천동': 'Deokcheon-dong',
        '화명동': 'Hwamyeong-dong',
        '구포': 'Gupo',
        '만덕동': 'Mandeok-dong',
        '괘법동': 'Gwaebeop-dong',
        '금정구청': 'Geumjeong-gu Office',
        '부산대': 'Pusan National University',
        '장전동': 'Jangjeong-dong',
        '구서동': 'Guseo-dong',
        '남산동': 'Namsan-dong',
        '사상구청': 'Sasang-gu Office',
        '주례동': 'Jurye-dong',
        '감전동': 'Gamjeon-dong',
        '엄궁동': 'Eomgung-dong',
        '하단': 'Hadan',
        '하단동': 'Hadan-dong',
        '다대포': 'Dadaepo',
        '신평동': 'Sinpyeong-dong',
        '괴정동': 'Goejeong-dong',
        '당리동': 'Dangni-dong',
        
        // 대구광역시
        '대구': 'Daegu',
        '수성': 'Suseong',
        '달서': 'Dalseo',
        '달성': 'Dalseong',
        
        // 대구 주요 동 단위
        '수성구청': 'Suseong-gu Office',
        '범어동': 'Beomeo-dong',
        '만촌동': 'Manchon-dong',
        '수성못': 'Suseong Lake',
        '황금동': 'Hwanggeum-dong',
        '두류동': 'Duryu-dong',
        '성서': 'Seongseo',
        '성서공단': 'Seongseo Industrial Complex',
        '월배': 'Wolbae',
        '대곡': 'Daegok',
        '동대구': 'Dongdaegu',
        '동구대구': 'Dong-gu',
        '신천동': 'Sincheon-dong',
        '수창동': 'Suchang-dong',
        '반월당': 'Banwoldang',
        '명덕': 'Myeongdeok',
        '대구역': 'Daegu Station',
        '칠성동': 'Chilseong-dong',
        '침산동': 'Chimsan-dong',
        '북구청': 'Buk-gu Office',
        '복현동': 'Bokhyeon-dong',
        '산격동': 'Sangyeok-dong',
        '칠곡': 'Chilgok',
        
        // 광주광역시
        '광주광역시': 'Gwangju',
        '광산': 'Gwangsan',
        '서구': 'Seo-gu',
        '남구광주': 'Nam-gu',
        
        // 광주 주요 동 단위
        '수완동': 'Suwan-dong',
        '첨단': 'Cheomdan',
        '첨단동': 'Cheomdan-dong',
        '하남': 'Hanam',
        '운남동': 'Unnam-dong',
        '월계동': 'Wolgye-dong',
        '충장로': 'Chungjang-ro',
        '금남로': 'Geumnam-ro',
        '상무': 'Sangmu',
        '상무동': 'Sangmu-dong',
        '유스퀘어': 'U-Square',
        '풍암동': 'Pungam-dong',
        '송정동광주': 'Songjeong-dong',
        '송정역광주': 'Songjeong Station',
        '양동': 'Yang-dong',
        '봉선동': 'Bongseon-dong',
        
        // 대전광역시
        '대전': 'Daejeon',
        '유성': 'Yuseong',
        '서구대전': 'Seo-gu',
        '중구대전': 'Jung-gu',
        '동구대전': 'Dong-gu',
        '대덕': 'Daedeok',
        
        // 대전 주요 동 단위
        '유성구청': 'Yuseong-gu Office',
        '봉명동': 'Bongmyeong-dong',
        '노은동': 'Noeun-dong',
        '신성동': 'Sinseong-dong',
        '궁동': 'Gung-dong',
        '도룡동': 'Doryong-dong',
        '관저동': 'Gwanjeo-dong',
        '둔산': 'Dunsan',
        '둔산동': 'Dunsan-dong',
        '갈마동': 'Galma-dong',
        '월평동': 'Wolpyeong-dong',
        '용문동': 'Yongmun-dong',
        '은행동': 'Eunhaeng-dong',
        '대전역': 'Daejeon Station',
        '중촌동': 'Jungchon-dong',
        '대동': 'Daedong',
        '목동대전': 'Mok-dong',
        '용전동': 'Yongjeon-dong',
        '대화동대전': 'Daehwa-dong',
        '신탄진': 'Sintanjin',
        '법동': 'Beop-dong',
        '송촌동': 'Songchon-dong',
        
        // 울산광역시
        '울산': 'Ulsan',
        '남구울산': 'Nam-gu',
        '동구울산': 'Dong-gu',
        '북구울산': 'Buk-gu',
        '중구울산': 'Jung-gu',
        '울주': 'Ulju',
        
        // 울산 주요 동 단위
        '삼산동': 'Samsan-dong',
        '신정동울산': 'Sinjeong-dong',
        '달동': 'Dal-dong',
        '옥동': 'Ok-dong',
        '무거동': 'Mugeo-dong',
        '남목': 'Nammok',
        '성남동울산': 'Seongnam-dong',
        '야음동': 'Yaeum-dong',
        '태화': 'Taehwa',
        '성안': 'Seongan',
        '북구청': 'Buk-gu Office',
        '화봉동': 'Hwabong-dong',
        '송정동울산': 'Songjeong-dong',
        '농소': 'Nongso',
        '양정동울산': 'Yangjeong-dong',
        '언양': 'Eonyang',
        '범서': 'Beomseo',
        '온산': 'Onsan',
        '온양': 'Onyang',
        
        // 세종특별자치시
        '세종': 'Sejong',
        
        // 강원특별자치도
        '춘천': 'Chuncheon',
        '원주': 'Wonju',
        '강릉': 'Gangneung',
        '동해': 'Donghae',
        '태백': 'Taebaek',
        '속초': 'Sokcho',
        '삼척': 'Samcheok',
        '홍천': 'Hongcheon',
        '횡성': 'Hoengseong',
        '영월': 'Yeongwol',
        '평창': 'Pyeongchang',
        '정선': 'Jeongseon',
        '철원': 'Cheorwon',
        '화천': 'Hwacheon',
        '양구': 'Yanggu',
        '인제': 'Inje',
        '고성': 'Goseong',
        '양양': 'Yangyang',
        
        // 충청북도
        '청주': 'Cheongju',
        '충주': 'Chungju',
        '제천': 'Jecheon',
        '보은': 'Boeun',
        '옥천': 'Okcheon',
        '영동': 'Yeongdong',
        '증평': 'Jeungpyeong',
        '진천': 'Jincheon',
        '괴산': 'Goesan',
        '음성': 'Eumseong',
        '단양': 'Danyang',
        
        // 충청남도
        '천안': 'Cheonan',
        '공주': 'Gongju',
        '보령': 'Boryeong',
        '아산': 'Asan',
        '서산': 'Seosan',
        '논산': 'Nonsan',
        '계룡': 'Gyeryong',
        '당진': 'Dangjin',
        '금산': 'Geumsan',
        '부여': 'Buyeo',
        '서천': 'Seocheon',
        '청양': 'Cheongyang',
        '홍성': 'Hongseong',
        '예산': 'Yesan',
        '태안': 'Taean',
        
        // 전라북도
        '전주': 'Jeonju',
        '군산': 'Gunsan',
        '익산': 'Iksan',
        '정읍': 'Jeongeup',
        '남원': 'Namwon',
        '김제': 'Gimje',
        '완주': 'Wanju',
        '진안': 'Jinan',
        '무주': 'Muju',
        '장수': 'Jangsu',
        '임실': 'Imsil',
        '순창': 'Sunchang',
        '고창': 'Gochang',
        '부안': 'Buan',
        
        // 전라남도
        '목포': 'Mokpo',
        '여수': 'Yeosu',
        '순천': 'Suncheon',
        '나주': 'Naju',
        '광양': 'Gwangyang',
        '담양': 'Damyang',
        '곡성': 'Gokseong',
        '구례': 'Gurye',
        '고흥': 'Goheung',
        '보성': 'Boseong',
        '화순': 'Hwasun',
        '장흥': 'Jangheung',
        '강진': 'Gangjin',
        '해남': 'Haenam',
        '영암': 'Yeongam',
        '무안': 'Muan',
        '함평': 'Hampyeong',
        '영광': 'Yeonggwang',
        '장성': 'Jangseong',
        '완도': 'Wando',
        '진도': 'Jindo',
        '신안': 'Sinan',
        
        // 경상북도
        '포항': 'Pohang',
        '경주': 'Gyeongju',
        '김천': 'Gimcheon',
        '안동': 'Andong',
        '구미': 'Gumi',
        '영주': 'Yeongju',
        '영천': 'Yeongcheon',
        '상주': 'Sangju',
        '문경': 'Mungyeong',
        '경산': 'Gyeongsan',
        '군위': 'Gunwi',
        '의성': 'Uiseong',
        '청송': 'Cheongsong',
        '영양': 'Yeongyang',
        '영덕': 'Yeongdeok',
        '청도': 'Cheongdo',
        '고령': 'Goryeong',
        '성주': 'Seongju',
        '칠곡': 'Chilgok',
        '예천': 'Yecheon',
        '봉화': 'Bonghwa',
        '울진': 'Uljin',
        '울릉': 'Ulleung',
        '독도': 'Dokdo',
        
        // 경상남도
        '창원': 'Changwon',
        '진주': 'Jinju',
        '통영': 'Tongyeong',
        '사천': 'Sacheon',
        '김해': 'Gimhae',
        '밀양': 'Miryang',
        '거제': 'Geoje',
        '양산': 'Yangsan',
        '의령': 'Uiryeong',
        '함안': 'Haman',
        '창녕': 'Changnyeong',
        '고성경남': 'Goseong',
        '남해': 'Namhae',
        '하동': 'Hadong',
        '산청': 'Sancheong',
        '함양': 'Hamyang',
        '거창': 'Geochang',
        '합천': 'Hapcheon',
        
        // 제주특별자치도
        '제주': 'Jeju',
        '서귀포': 'Seogwipo',
        '애월': 'Aewol',
        '조천': 'Jocheon',
        '한림': 'Hallim',
        '한경': 'Hangyeong',
        '대정': 'Daejeong',
        '안덕': 'Andeok',
        '표선': 'Pyoseon',
        '성산': 'Seongsan',
        '우도': 'Udo',
        '마라도': 'Marado',
        
        // 주요 관광지/명소
        '명동': 'Myeongdong',
        '홍대': 'Hongdae',
        '이태원': 'Itaewon',
        '잠실': 'Jamsil',
        '삼성동': 'Samseong-dong',
        '여의도': 'Yeouido',
        '신촌': 'Sinchon',
        '건대': 'Konkuk University',
        '압구정': 'Apgujeong',
        '청담': 'Cheongdam',
        '광화문': 'Gwanghwamun',
        '시청': 'City Hall',
        '남산': 'Namsan',
        '북촌': 'Bukchon',
        '인사동': 'Insadong',
        '가로수길': 'Garosu-gil',
        '코엑스': 'COEX',
        '롯데월드': 'Lotte World',
        '에버랜드': 'Everland',
        '남이섬': 'Nami Island',
        '설악산': 'Seoraksan',
        '한라산': 'Hallasan',
        '지리산': 'Jirisan',
        
        // === 일본 ===
        '도쿄': 'Tokyo',
        '동경': 'Tokyo',
        '오사카': 'Osaka',
        '교토': 'Kyoto',
        '요코하마': 'Yokohama',
        '나고야': 'Nagoya',
        '삿포로': 'Sapporo',
        '후쿠오카': 'Fukuoka',
        '고베': 'Kobe',
        '센다이': 'Sendai',
        '히로시마': 'Hiroshima',
        '나가사키': 'Nagasaki',
        '오키나와': 'Okinawa',
        '나하': 'Naha',
        '나라': 'Nara',
        '가나자와': 'Kanazawa',
        '오타루': 'Otaru',
        '하코다테': 'Hakodate',
        '기타큐슈': 'Kitakyushu',
        '니가타': 'Niigata',
        '시즈오카': 'Shizuoka',
        '후지산': 'Mount Fuji',
        '도쿄타워': 'Tokyo Tower',
        '신주쿠': 'Shinjuku',
        '시부야': 'Shibuya',
        '하라주쿠': 'Harajuku',
        '아키하바라': 'Akihabara',
        '긴자': 'Ginza',
        '우에노': 'Ueno',
        '아사쿠사': 'Asakusa',
        '롯폰기': 'Roppongi',
        '오다이바': 'Odaiba',
        '디즈니랜드': 'Tokyo Disneyland',
        
        // === 중국 ===
        '베이징': 'Beijing',
        '북경': 'Beijing',
        '상하이': 'Shanghai',
        '상해': 'Shanghai',
        '광저우': 'Guangzhou',
        '광주': 'Guangzhou',
        '선전': 'Shenzhen',
        '심천': 'Shenzhen',
        '청두': 'Chengdu',
        '성도': 'Chengdu',
        '충칭': 'Chongqing',
        '중경': 'Chongqing',
        '텐진': 'Tianjin',
        '천진': 'Tianjin',
        '항저우': 'Hangzhou',
        '항주': 'Hangzhou',
        '우한': 'Wuhan',
        '시안': 'Xian',
        '서안': 'Xian',
        '난징': 'Nanjing',
        '남경': 'Nanjing',
        '칭다오': 'Qingdao',
        '청도': 'Qingdao',
        '샤먼': 'Xiamen',
        '하문': 'Xiamen',
        '쿤밍': 'Kunming',
        '곤명': 'Kunming',
        '다롄': 'Dalian',
        '대련': 'Dalian',
        '구이린': 'Guilin',
        '계림': 'Guilin',
        '하얼빈': 'Harbin',
        '합이빈': 'Harbin',
        '홍콩': 'Hong Kong',
        '마카오': 'Macau',
        '타이베이': 'Taipei',
        '타이페이': 'Taipei',
        '가오슝': 'Kaohsiung',
        '타이중': 'Taichung',
        
        // === 태국 ===
        '방콕': 'Bangkok',
        '치앙마이': 'Chiang Mai',
        '푸켓': 'Phuket',
        '파타야': 'Pattaya',
        '후아힌': 'Hua Hin',
        '치앙라이': 'Chiang Rai',
        '끄라비': 'Krabi',
        '코사무이': 'Ko Samui',
        '아유타야': 'Ayutthaya',
        
        // === 베트남 ===
        '하노이': 'Hanoi',
        '호치민': 'Ho Chi Minh City',
        '사이공': 'Ho Chi Minh City',
        '다낭': 'Da Nang',
        '나짱': 'Nha Trang',
        '호이안': 'Hoi An',
        '후에': 'Hue',
        '달랏': 'Da Lat',
        '하롱베이': 'Ha Long Bay',
        '무이네': 'Mui Ne',
        '껀터': 'Can Tho',
        
        // === 싱가포르 ===
        '싱가포르': 'Singapore',
        '싱가폴': 'Singapore',
        
        // === 말레이시아 ===
        '쿠알라룸푸르': 'Kuala Lumpur',
        '페낭': 'Penang',
        '조호바루': 'Johor Bahru',
        '코타키나발루': 'Kota Kinabalu',
        '랑카위': 'Langkawi',
        '말라카': 'Malacca',
        
        // === 인도네시아 ===
        '자카르타': 'Jakarta',
        '발리': 'Bali',
        '수라바야': 'Surabaya',
        '반둥': 'Bandung',
        '족자카르타': 'Yogyakarta',
        '메단': 'Medan',
        
        // === 필리핀 ===
        '마닐라': 'Manila',
        '세부': 'Cebu',
        '보라카이': 'Boracay',
        '다바오': 'Davao',
        '팔라완': 'Palawan',
        
        // === 미국 ===
        '뉴욕': 'New York',
        '로스앤젤레스': 'Los Angeles',
        '엘에이': 'Los Angeles',
        '시카고': 'Chicago',
        '샌프란시스코': 'San Francisco',
        '라스베가스': 'Las Vegas',
        '시애틀': 'Seattle',
        '보스턴': 'Boston',
        '워싱턴': 'Washington',
        '마이애미': 'Miami',
        '올랜도': 'Orlando',
        '샌디에이고': 'San Diego',
        '포틀랜드': 'Portland',
        '덴버': 'Denver',
        '피닉스': 'Phoenix',
        '휴스턴': 'Houston',
        '달라스': 'Dallas',
        '오스틴': 'Austin',
        '애틀랜타': 'Atlanta',
        '뉴올리언스': 'New Orleans',
        '하와이': 'Hawaii',
        '호놀룰루': 'Honolulu',
        '알래스카': 'Alaska',
        '앵커리지': 'Anchorage',
        
        // === 캐나다 ===
        '토론토': 'Toronto',
        '밴쿠버': 'Vancouver',
        '몬트리올': 'Montreal',
        '캘거리': 'Calgary',
        '오타와': 'Ottawa',
        '퀘벡': 'Quebec',
        '에드먼턴': 'Edmonton',
        '위니펙': 'Winnipeg',
        
        // === 영국 ===
        '런던': 'London',
        '맨체스터': 'Manchester',
        '에든버러': 'Edinburgh',
        '글래스고': 'Glasgow',
        '리버풀': 'Liverpool',
        '버밍엄': 'Birmingham',
        '옥스퍼드': 'Oxford',
        '케임브리지': 'Cambridge',
        
        // === 프랑스 ===
        '파리': 'Paris',
        '니스': 'Nice',
        '마르세유': 'Marseille',
        '리옹': 'Lyon',
        '칸': 'Cannes',
        '보르도': 'Bordeaux',
        '스트라스부르': 'Strasbourg',
        '몽펠리에': 'Montpellier',
        
        // === 독일 ===
        '베를린': 'Berlin',
        '뮌헨': 'Munich',
        '프랑크푸르트': 'Frankfurt',
        '함부르크': 'Hamburg',
        '쾰른': 'Cologne',
        '드레스덴': 'Dresden',
        '하이델베르크': 'Heidelberg',
        
        // === 이탈리아 ===
        '로마': 'Rome',
        '밀라노': 'Milan',
        '베니스': 'Venice',
        '베네치아': 'Venice',
        '피렌체': 'Florence',
        '나폴리': 'Naples',
        '베로나': 'Verona',
        '토리노': 'Turin',
        '볼로냐': 'Bologna',
        
        // === 스페인 ===
        '마드리드': 'Madrid',
        '바르셀로나': 'Barcelona',
        '세비야': 'Seville',
        '발렌시아': 'Valencia',
        '그라나다': 'Granada',
        '톨레도': 'Toledo',
        '말라가': 'Malaga',
        
        // === 네덜란드 ===
        '암스테르담': 'Amsterdam',
        '로테르담': 'Rotterdam',
        '헤이그': 'The Hague',
        
        // === 스위스 ===
        '취리히': 'Zurich',
        '제네바': 'Geneva',
        '베른': 'Bern',
        '루체른': 'Lucerne',
        '인터라켄': 'Interlaken',
        
        // === 오스트리아 ===
        '빈': 'Vienna',
        '잘츠부르크': 'Salzburg',
        '인스브루크': 'Innsbruck',
        
        // === 체코 ===
        '프라하': 'Prague',
        '체스키크룸로프': 'Cesky Krumlov',
        
        // === 러시아 ===
        '모스크바': 'Moscow',
        '상트페테르부르크': 'Saint Petersburg',
        '블라디보스토크': 'Vladivostok',
        
        // === 호주 ===
        '시드니': 'Sydney',
        '멜버른': 'Melbourne',
        '브리즈번': 'Brisbane',
        '퍼스': 'Perth',
        '애들레이드': 'Adelaide',
        '골드코스트': 'Gold Coast',
        '케언스': 'Cairns',
        
        // === 뉴질랜드 ===
        '오클랜드': 'Auckland',
        '웰링턴': 'Wellington',
        '크라이스트처치': 'Christchurch',
        '퀸스타운': 'Queenstown',
        
        // === 중동 ===
        '두바이': 'Dubai',
        '아부다비': 'Abu Dhabi',
        '도하': 'Doha',
        '이스탄불': 'Istanbul',
        '예루살렘': 'Jerusalem',
        '텔아비브': 'Tel Aviv',
        
        // === 인도 ===
        '뭄바이': 'Mumbai',
        '델리': 'Delhi',
        '뉴델리': 'New Delhi',
        '방갈로르': 'Bangalore',
        '첸나이': 'Chennai',
        '콜카타': 'Kolkata',
        '자이푸르': 'Jaipur',
        '고아': 'Goa',
        
        // === 남미 ===
        '리우데자네이루': 'Rio de Janeiro',
        '상파울루': 'Sao Paulo',
        '부에노스아이레스': 'Buenos Aires',
        '리마': 'Lima',
        '산티아고': 'Santiago',
        '쿠스코': 'Cusco',
        '카르타헤나': 'Cartagena',
        
        // === 아프리카 ===
        '카이로': 'Cairo',
        '케이프타운': 'Cape Town',
        '마라케시': 'Marrakech',
        '나이로비': 'Nairobi'
    };

    // 한글 감지 함수
    function containsKorean(text) {
        const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
        return koreanRegex.test(text);
    }

    // 한글 지명을 영어로 변환
    function translateKoreanToEnglish(query) {
        const trimmed = query.trim();
        
        // 한글이 포함되어 있는지 확인
        if (!containsKorean(trimmed)) {
            return trimmed; // 한글이 없으면 그대로 반환
        }
        
        // 직접 매칭 먼저 시도
        if (koreanToEnglishMap[trimmed]) {
            return koreanToEnglishMap[trimmed];
        }
        
        // 부분 매칭 시도 (예: "강남역" -> "강남")
        for (const [korean, english] of Object.entries(koreanToEnglishMap)) {
            if (trimmed.includes(korean)) {
                return english;
            }
        }
        
        // 매칭되지 않으면 원본 반환 (API가 한글도 처리 가능)
        return trimmed;
    }

    async function getWeatherByCity(city) {
        const trimmed = city.trim();
        if (!trimmed) {
            alert('도시 이름을 입력해주세요.');
            return;
        }

        currentWeatherDiv.innerHTML = '<p>날씨 정보를 불러오는 중...</p>';
        forecastDiv.innerHTML = '';

        try {
            // 한글 입력을 영어로 변환
            const translatedCity = translateKoreanToEnglish(trimmed);
            console.log(`검색어: "${trimmed}" -> "${translatedCity}"`);
            
            const geoResult = await fetchGeocode(translatedCity);
            if (!geoResult) {
                throw new Error('도시 정보를 찾을 수 없습니다. 다른 지역명을 시도해보세요.');
            }

            const label = geoResult.country ? `${geoResult.name}, ${geoResult.country}` : geoResult.name;
            await fetchWeatherForecast(geoResult.latitude, geoResult.longitude, label);
        } catch (error) {
            handleError(error.message);
        }
    }

    function getWeatherByCurrentLocation() {
        if (!('geolocation' in navigator)) {
            handleError('이 브라우저에서는 위치 정보 기능을 지원하지 않습니다.');
            return;
        }

        currentWeatherDiv.innerHTML = '<p>현재 위치를 확인하는 중...</p>';
        forecastDiv.innerHTML = '';

        navigator.geolocation.getCurrentPosition(async position => {
            const { latitude, longitude } = position.coords;
            let label = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;

            try {
                const reverseResult = await fetchReverseGeocode(latitude, longitude);
                if (reverseResult) {
                    label = reverseResult.country ? `${reverseResult.name}, ${reverseResult.country}` : reverseResult.name;
                }
            } catch (error) {
                console.error('Reverse geocoding 실패:', error);
            }

            await fetchWeatherForecast(latitude, longitude, label);
        }, () => handleError('위치 정보를 가져올 수 없습니다. 브라우저 설정을 확인해주세요.'));
    }

    async function fetchGeocode(query) {
        // 검색 결과 개수를 늘려서 더 많은 후보 반환
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('도시 정보를 찾을 수 없습니다.');
        }
        const data = await response.json();
        if (!data.results || data.results.length === 0) {
            return null;
        }
        
        // 대한민국 결과 우선 처리 (더 세밀한 지역 검색)
        const koreaResults = data.results.filter(r => r.country === 'South Korea' || r.country_code === 'KR');
        
        // 한국 결과가 있으면 가장 관련성 높은 것 선택
        if (koreaResults.length > 0) {
            const result = koreaResults[0];
            return {
                latitude: result.latitude,
                longitude: result.longitude,
                name: result.name,
                country: result.country || '',
                admin1: result.admin1 || '', // 시/도
                admin2: result.admin2 || '', // 시/군/구
                admin3: result.admin3 || ''  // 읍/면/동
            };
        }
        
        // 한국 결과가 없으면 첫 번째 결과 사용
        const result = data.results[0];
        return {
            latitude: result.latitude,
            longitude: result.longitude,
            name: result.name,
            country: result.country || ''
        };
    }

    async function fetchReverseGeocode(latitude, longitude) {
        const url = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&count=1&language=en&format=json`;
        const response = await fetch(url);
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        if (!data.results || data.results.length === 0) {
            return null;
        }
        const result = data.results[0];
        return {
            name: result.name,
            country: result.country || ''
        };
    }

    async function fetchWeatherForecast(latitude, longitude, locationLabel) {
        try {
            const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('날씨 정보를 가져올 수 없습니다.');
            }
            const data = await response.json();
            displayCurrentWeather(data, locationLabel);
            displayForecast(data);
        } catch (error) {
            handleError(error.message);
        }
    }

    function displayCurrentWeather(data, locationLabel) {
        if (!data.current_weather) {
            handleError('현재 날씨 정보를 찾을 수 없습니다.');
            return;
        }

        const { current_weather, timezone_abbreviation } = data;
        const details = getWeatherDetails(current_weather.weathercode);
        const localTime = current_weather.time ? `${current_weather.time.replace('T', ' ')} ${timezone_abbreviation || ''}`.trim() : '';

        currentWeatherDiv.innerHTML = `
            <div class="location-details">
                <h2>${locationLabel}</h2>
                <p>${localTime}</p>
            </div>
            <div class="weather-details">
                <img src="${details.icon}" alt="${details.description}" class="weather-icon-large">
                <p class="temperature">${current_weather.temperature}°C</p>
                <p class="condition">${details.description}</p>
            </div>
        `;
    }

    function displayForecast(data) {
        if (!data.daily || !data.daily.time) {
            forecastDiv.innerHTML = '<p class="error-message">예보 정보를 찾을 수 없습니다.</p>';
            return;
        }

        const { time, weathercode, temperature_2m_max, temperature_2m_min } = data.daily;
        let forecastHTML = '<h3>주간 예보</h3><div class="forecast-cards-container">';

        for (let i = 0; i < time.length; i += 1) {
            const details = getWeatherDetails(weathercode[i]);
            forecastHTML += `
                <div class="forecast-card">
                    <p class="forecast-date">${time[i]}</p>
                    <img src="${details.icon}" alt="${details.description}" class="weather-icon-small">
                    <p class="forecast-temp">
                        <span class="temp-max">${temperature_2m_max[i]}°</span> /
                        <span class="temp-min">${temperature_2m_min[i]}°</span>
                    </p>
                </div>
            `;
        }

        forecastHTML += '</div>';
        forecastDiv.innerHTML = forecastHTML;
    }

    function getWeatherDetails(code) {
        const icon = getIconForCode(code);
        const description = weatherDescriptionMap[code] || (code >= 95 ? '뇌우' : (code >= 80 ? '소나기' : (code >= 71 ? '눈' : (code >= 51 ? '비' : '변화무쌍한 날씨'))));
        return { icon, description };
    }

    function getIconForCode(code) {
        if (code === 0) {
            return ICONS.clear;
        }
        if (code === 1 || code === 2) {
            return ICONS.partly;
        }
        if (code === 3) {
            return ICONS.cloudy;
        }
        if (code === 45 || code === 48) {
            return ICONS.fog;
        }
        if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
            return ICONS.rain;
        }
        if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
            return ICONS.snow;
        }
        if (code >= 95) {
            return ICONS.storm;
        }
        return ICONS.cloudy;
    }

    function handleError(message) {
        currentWeatherDiv.innerHTML = `<p class="error-message">${message}</p>`;
        forecastDiv.innerHTML = '';
    }

    searchBtn.addEventListener('click', () => getWeatherByCity(cityInput.value));
    cityInput.addEventListener('keypress', event => {
        if (event.key === 'Enter') {
            getWeatherByCity(cityInput.value);
        }
    });
    currentLocationBtn.addEventListener('click', getWeatherByCurrentLocation);

    // 페이지 로드 시 자동으로 현재 위치의 날씨 표시
    getWeatherByCurrentLocation();
});
