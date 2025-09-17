// app/kosullar/page.tsx

import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Kiralama Koşulları | Rentacar",
  description: "Araç kiralama için gerekli olan ehliyet, yaş, ödeme ve sigorta koşulları hakkında detaylı bilgi alın.",
};

// Başlıklar için küçük bir yardımcı bileşen
const SectionTitle = ({ title }: { title: string }) => (
  <h2 className="text-2xl font-bold text-white border-l-4 border-blue-500 pl-4 mb-4">
    {title}
  </h2>
);

export default function KiralamaKosullariPage() {
  return (
    <div className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold text-center text-white mb-12">
          Araç Kiralama Koşulları
        </h1>

        <div className="max-w-4xl mx-auto space-y-10">
          <section>
            <SectionTitle title="Sürücü Yaşı ve Ehliyet Süresi" />
            <div className="space-y-2 pl-6">
              <p>Ekonomik grup araçlar için en az **21 yaş** ve **1 yıllık** ehliyet gerekmektedir.</p>
              <p>Orta grup araçlar için en az **25 yaş** ve **2 yıllık** ehliyet gerekmektedir.</p>
              <p>Üst ve lüks grup araçlar için en az **27 yaş** ve **3 yıllık** ehliyet gerekmektedir.</p>
            </div>
          </section>

          <section>
            <SectionTitle title="Ek Sürücü" />
            <div className="space-y-2 pl-6">
              <p>Kiralanan aracı, kiralayan kişi dışında birinin kullanabilmesi için ek sürücü bildiriminin yapılması ve bu sürücünün de ana sürücü ile aynı yaş ve ehliyet kriterlerini karşılaması zorunludur. Ek sürücü hizmeti ek ücrete tabidir.</p>
            </div>
          </section>
          
          <section>
            <SectionTitle title="Ödeme ve Depozito" />
            <div className="space-y-2 pl-6">
              <p>Toplam kiralama bedeli, kiralama başlangıcında sürücüye ait ve geçerli bir **kredi kartı** ile tahsil edilir. Nakit ödeme ve debit kart kabul edilmemektedir.</p>
              <p>Araç grubuna göre değişen tutarlarda bir ön provizyon (depozito) bedeli, kiralama başında sürücünün kredi kartından bloke edilir. Bu bedel, kiralama bitiminde aracın hasarsız ve eksiksiz iade edilmesi durumunda bankanın işlem süresine bağlı olarak 7-15 iş günü içinde iade edilir.</p>
            </div>
          </section>
          
          <section>
            <SectionTitle title="Sigorta Kapsamı" />
            <div className="space-y-2 pl-6">
              <p>Tüm fiyatlarımıza Muafiyetli Kaza Sigortası (CDW) dahildir. Bu sigorta, kaza durumunda oluşacak hasarın belirli bir muafiyet bedelini aşan kısmını karşılar.</p>
              <p>Alkol veya uyuşturucu etkisi altında araç kullanma, yasal hız sınırlarını aşma gibi trafik kurallarının ihlali durumlarında sigorta geçersiz sayılır ve tüm hasar sorumluluğu kiracıya aittir.</p>
              <p>İsteğe bağlı olarak Mini Hasar Sigortası (LCF), Lastik-Cam-Far Sigortası gibi ek güvenceler satın alınabilir.</p>
            </div>
          </section>
          
          <section>
            <SectionTitle title="Yakıt Politikası" />
            <div className="space-y-2 pl-6">
              <p>Araçlar, **dolu depo** ile teslim edilir ve **dolu depo** ile iade edilmesi beklenir (Dolu Al / Dolu Bırak). Aracın eksik yakıtla iade edilmesi durumunda, eksik yakıt bedeline ek olarak hizmet bedeli yansıtılır.</p>
            </div>
          </section>
          
          <section>
            <SectionTitle title="Gerekli Belgeler" />
            <div className="space-y-2 pl-6">
              <p>Kiralama esnasında aşağıdaki belgelerin aslının ibraz edilmesi zorunludur:</p>
              <ul className="list-disc list-inside ml-4">
                <li>Geçerli Sürücü Belgesi (Ehliyet)</li>
                <li>Geçerli bir Kimlik Kartı (T.C. vatandaşları için) veya Pasaport</li>
                <li>Kiracı adına düzenlenmiş ve geçerli bir Kredi Kartı</li>
              </ul>
            </div>
          </section>

          <section>
            <SectionTitle title="Trafik Cezaları ve Geçiş Ücretleri" />
            <div className="space-y-2 pl-6">
              <p>Kiralama süresi boyunca oluşan tüm trafik cezaları, otoyol ve köprü geçiş ücretleri (HGS/OGS) kiracıya aittir. Bu bedeller, kiralama bitiminde veya cezanın tarafımıza tebliğ edildiği tarihte kiracının kredi kartından tahsil edilir.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}