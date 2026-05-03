
'use client';

export default function IletisimFormu() {
  return (
    <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-gray-100">
      <form className="space-y-6" onSubmit={(e) => {
        e.preventDefault();
        alert('Mesajınız simüle edildi. (İletişim formu şu an sadece UI olarak çalışmaktadır)');
      }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Adınız Soyadınız</label>
            <input 
              type="text" 
              placeholder="Örn: Ahmet Yılmaz"
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">E-posta Adresiniz</label>
            <input 
              type="email" 
              placeholder="Örn: ahmet@mail.com"
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Konu</label>
          <input 
            type="text" 
            placeholder="Mesajınızın konusu"
            required
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Mesajınız</label>
          <textarea 
            rows={5}
            placeholder="Bize ne söylemek istersiniz?"
            required
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
          ></textarea>
        </div>

        <button 
          type="submit"
          className="w-full bg-gray-900 hover:bg-black text-white font-black py-5 rounded-2xl transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2 group"
        >
          Mesajı Gönder 
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </form>
    </div>
  );
}
