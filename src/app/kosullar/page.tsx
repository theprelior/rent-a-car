import { type Metadata } from "next";
import { ShieldCheck } from "lucide-react"; 

export const metadata: Metadata = {
  title: "Kiralama Koşulları | Rentacar",
  description: "Araç kiralama için gerekli olan ehliyet, yaş, ödeme ve sigorta koşulları hakkında detaylı bilgi alın.",
};

// Başlıklar için yardımcı bileşen
const SectionTitle = ({ title }: { title: string }) => (
  <div className="flex items-center gap-4">
    <div className="flex-shrink-0">
      <ShieldCheck className="h-8 w-8 text-yellow-400" />
    </div>
    <h2 className="text-2xl font-bold text-white">{title}</h2>
  </div>
);

export default function KiralamaKosullariPage() {
  return (
    <div className="bg-black text-gray-300 min-h-screen pt-16">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Araç Kiralama Koşulları
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-400">
            Güvenli ve sorunsuz bir kiralama deneyimi için lütfen aşağıdaki koşulları dikkatlice inceleyiniz.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          
          <section className="rounded-xl bg-neutral-900 p-8 border border-neutral-700/50">
            <SectionTitle title="Sürücü Belgesi ve Kullanım Yaşı" />
            <div className="mt-6 space-y-4 pl-12 text-lg">
              <p>Araç kiralamak için en az **25 yaşını** doldurmuş olmak ve en az **3 yıllık** sürücü belgesine sahip olmak mecburiyeti vardır.</p>
              <p>Kiracı dışında aracın başkası tarafından kullanılabilmesi (ilave sürücü), ancak sürücü belgesi ve kullanım yaşı kurallarına uygun sürücülerin geçerli kimlik ve ehliyetlerinin sözleşmeye kaydı ile mümkündür. Aksi takdirde, kaydı olmayan bir sürücünün yaptığı kazada sigortalar geçersiz sayılır.</p>
            </div>
          </section>

          <section className="rounded-xl bg-neutral-900 p-8 border border-neutral-700/50">
            <SectionTitle title="Kiralama Süresi ve Gecikmeler" />
            <div className="mt-6 space-y-4 pl-12 text-lg">
              <p>En kısa kiralama süresi **24 saattir**. Teslim gecikmelerinde her ek saat için günlük ücretin 1/3'ü alınır.</p>
              <p>Toplam 3 saati aşan gecikmelerde tam gün ücreti (o günkü geçerli fiyat üzerinden) tahsil edilir.</p>
              <p>Uzun süreli (en az 30 gün) kiralamalarda özel fiyatlar uygulanır. Detaylı bilgi için <a href="tel:+905320554481" className="font-semibold text-yellow-400 hover:underline">+90 532 055 44 81</a> numaramızdan bizlere ulaşabilirsiniz.</p>
            </div>
          </section>

          <section className="rounded-xl bg-neutral-900 p-8 border border-neutral-700/50">
            <SectionTitle title="Fiyatlara Dahil Olan ve Olmayan Hususlar" />
            <div className="mt-6 space-y-4 pl-12 text-lg">
              <p><strong className="text-green-400">Dahil Olanlar:</strong> Araçların sınırsız kilometre kullanım hakkı, standart araç bakım giderleri ve kasko (Muafiyetli Kaza Sigortası).</p>
              <p><strong className="text-red-400">Dahil Olmayanlar:</strong> Yakıt, köprü/otoyol ücretleri (HGS/OGS), trafik cezaları, ek sigortalar (Mini Hasar, LCF vb.), tek yön ücreti, araç teslim etme/alma ücretleri, bebek koltuğu gibi ekstralar ve Katma Değer Vergisi (KDV).</p>
            </div>
          </section>

          <section className="rounded-xl bg-neutral-900 p-8 border border-neutral-700/50">
            <SectionTitle title="Ödeme ve Gerekli Belgeler" />
            <div className="mt-6 space-y-4 pl-12 text-lg">
              <p>Toplam kiralama bedeli ve depozito, kiralama başlangıcında kiracı adına düzenlenmiş ve geçerli bir **kredi kartından** tahsil edilir.</p>
              <p>Kiralama esnasında aşağıdaki belgelerin aslının ibraz edilmesi zorunludur:</p>
              <ul className="list-disc list-inside ml-4 space-y-2 pt-2">
                <li>Geçerli Sürücü Belgesi (Ehliyet)</li>
                <li>Geçerli bir Kimlik Kartı veya Pasaport</li>
                <li>Kiracı adına düzenlenmiş ve geçerli bir Kredi Kartı</li>
              </ul>
            </div>
          </section>
          
          <section className="rounded-xl bg-neutral-900 p-8 border border-neutral-700/50">
            <SectionTitle title="Araç Teslimatı ve Yakıt Politikası" />
            <div className="mt-6 space-y-4 pl-12 text-lg">
              <p>Adana ofisimizden 24 saat kesintisiz olarak dilediğiniz gün ve saatte aracınızı teslim alabilirsiniz.</p>
              <p>Araçlar, **dolu depo** ile teslim edilir ve **dolu depo** ile iade edilmesi beklenir. Eksik yakıtla iade durumunda, eksik yakıt bedeline ek olarak hizmet bedeli yansıtılır.</p>
            </div>
          </section>

          <section className="rounded-xl bg-neutral-900 p-8 border border-neutral-700/50">
            <SectionTitle title="Trafik Cezaları ve Yasal Sorumluluklar" />
            <div className="mt-6 space-y-4 pl-12 text-lg">
              <p>Türkiye'deki trafik yasalarına uyulmamasından doğabilecek tüm cezalar (hız sınırı, park yasağı vb.) ve yasal sorumluluklar kiracıya aittir.</p>
              <p>Kiralama sonrası tarafımıza ulaşan trafik cezaları, ilgili tutar kiracının kredi kartından tahsil edilerek yansıtılır.</p>
              <p>Araçların herhangi bir nedenle resmi makamlar tarafından alıkonulması durumunda geçen süre, sözleşme süresine dahil edilir.</p>
            </div>
          </section>
          
          <div className="text-center text-sm text-gray-500 pt-8">
            <p>RENTORA, OTO KİRALAMA FİYAT VE KOŞULLARI İLE TARİFEDE BELİRTİLEN ARAÇ TİPLERİNİ ÖNCEDEN HABER VERMEKSİZİN DEĞİŞTİRME HAKKINI SAKLI TUTAR.</p>
          </div>

        </div>
      </div>
    </div>
  );
}