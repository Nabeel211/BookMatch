<?php

namespace Database\Seeders;

use App\Models\Book;
use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    public function run(): void
    {
        $books = [
            ['title'=>"Harry Potter dan Batu Bertuah",'author'=>"J.K. Rowling",'year'=>1997,'rating'=>4.8,'cover'=>"⚡",'color'=>"#4a1d96",'description'=>"Kisah anak yatim piatu yang mengetahui dirinya adalah penyihir dan memulai petualangan di Hogwarts.",'features'=>["fantasy","magic","adventure","young-adult","series","school","friendship","mystery"]],
            ['title'=>"The Lord of the Rings",'author'=>"J.R.R. Tolkien",'year'=>1954,'rating'=>4.9,'cover'=>"💍",'color'=>"#1a3a1a",'description'=>"Epik fantasi tentang perjalanan Frodo Baggins menghancurkan Cincin Satu untuk mengalahkan Sauron.",'features'=>["fantasy","epic","adventure","classic","series","mythology","friendship","quest"]],
            ['title'=>"Laskar Pelangi",'author'=>"Andrea Hirata",'year'=>2005,'rating'=>4.7,'cover'=>"🌈",'color'=>"#b45309",'description'=>"Kisah perjuangan 10 anak Belitung dalam menggapai mimpi dengan segala keterbatasan.",'features'=>["indonesia","inspirational","friendship","school","drama","childhood","hope"]],
            ['title'=>"Bumi Manusia",'author'=>"Pramoedya Ananta Toer",'year'=>1980,'rating'=>4.8,'cover'=>"🌏",'color'=>"#7f1d1d",'description'=>"Novel pertama tetralogi Buru, berlatar kolonialisme Belanda di Indonesia.",'features'=>["indonesia","historical","literary","romance","classic","drama","social-critique"]],
            ['title'=>"Dune",'author'=>"Frank Herbert",'year'=>1965,'rating'=>4.7,'cover'=>"🏜️",'color'=>"#92400e",'description'=>"Paul Atreides di planet gurun Arrakis, pusat perdagangan rempah terpenting di alam semesta.",'features'=>["sci-fi","epic","adventure","series","classic","dystopia","war"]],
            ['title'=>"1984",'author'=>"George Orwell",'year'=>1949,'rating'=>4.7,'cover'=>"👁️",'color'=>"#1c1917",'description'=>"Distopia di mana pemerintah totaliter Big Brother mengawasi setiap aspek kehidupan.",'features'=>["dystopia","sci-fi","classic","thriller","literary","philosophy","social-critique"]],
            ['title'=>"Brave New World",'author'=>"Aldous Huxley",'year'=>1932,'rating'=>4.5,'cover'=>"🧬",'color'=>"#0c4a6e",'description'=>"Dunia masa depan di mana manusia diproduksi secara ilmiah dan diprogram untuk sistem sosial.",'features'=>["dystopia","sci-fi","classic","philosophy","literary","satire"]],
            ['title'=>"The Hunger Games",'author'=>"Suzanne Collins",'year'=>2008,'rating'=>4.6,'cover'=>"🏹",'color'=>"#881337",'description'=>"Katniss Everdeen berjuang bertahan hidup di arena kompetisi maut yang ditayangkan sebagai hiburan.",'features'=>["dystopia","young-adult","adventure","series","action","romance","thriller"]],
            ['title'=>"Divergent",'author'=>"Veronica Roth",'year'=>2011,'rating'=>4.3,'cover'=>"🔥",'color'=>"#1e3a5f",'description'=>"Tris Prior menemukan dirinya tidak cocok dalam satu faksi dan harus memilih jalannya sendiri.",'features'=>["dystopia","young-adult","adventure","series","romance","action","thriller"]],
            ['title'=>"The Maze Runner",'author'=>"James Dashner",'year'=>2009,'rating'=>4.4,'cover'=>"🌀",'color'=>"#166534",'description'=>"Thomas terbangun di labirin misterius bersama pemuda yang tidak ingat masa lalunya.",'features'=>["dystopia","young-adult","mystery","series","survival","action","sci-fi"]],
            ['title'=>"Sherlock Holmes",'author'=>"Arthur Conan Doyle",'year'=>1887,'rating'=>4.6,'cover'=>"🔎",'color'=>"#312e81",'description'=>"Kisah detektif brilian Sherlock Holmes dan Dr. Watson memecahkan berbagai misteri.",'features'=>["mystery","detective","classic","thriller","series","crime","adventure"]],
            ['title'=>"And Then There Were None",'author'=>"Agatha Christie",'year'=>1939,'rating'=>4.7,'cover'=>"🏝️",'color'=>"#4c1d95",'description'=>"Sepuluh orang terdampar di pulau terpencil dan satu per satu terbunuh secara misterius.",'features'=>["mystery","detective","classic","thriller","crime","suspense","horror"]],
            ['title'=>"The Da Vinci Code",'author'=>"Dan Brown",'year'=>2003,'rating'=>4.4,'cover'=>"✝️",'color'=>"#713f12",'description'=>"Robert Langdon menyelidiki pembunuhan di Louvre yang mengungkap rahasia besar.",'features'=>["mystery","thriller","adventure","conspiracy","historical","series"]],
            ['title'=>"Sapiens",'author'=>"Yuval Noah Harari",'year'=>2011,'rating'=>4.6,'cover'=>"🦴",'color'=>"#065f46",'description'=>"Sejarah singkat umat manusia dari evolusi hingga era modern.",'features'=>["non-fiction","history","science","philosophy","education","social-critique"]],
            ['title'=>"Homo Deus",'author'=>"Yuval Noah Harari",'year'=>2015,'rating'=>4.4,'cover'=>"🔭",'color'=>"#0f172a",'description'=>"Eksplorasi masa depan umat manusia, AI, dan kemungkinan manusia menjadi tuhan.",'features'=>["non-fiction","history","science","philosophy","sci-fi","education"]],
            ['title'=>"Atomic Habits",'author'=>"James Clear",'year'=>2018,'rating'=>4.7,'cover'=>"⚛️",'color'=>"#1e3a5f",'description'=>"Panduan praktis membangun kebiasaan baik dan menghilangkan kebiasaan buruk.",'features'=>["self-help","non-fiction","psychology","productivity","practical"]],
            ['title'=>"The 7 Habits of Highly Effective People",'author'=>"Stephen Covey",'year'=>1989,'rating'=>4.5,'cover'=>"7️⃣",'color'=>"#1a3a1a",'description'=>"Tujuh prinsip yang mengubah cara seseorang hidup dan bekerja agar lebih efektif.",'features'=>["self-help","non-fiction","productivity","leadership","classic","psychology"]],
            ['title'=>"Thinking, Fast and Slow",'author'=>"Daniel Kahneman",'year'=>2011,'rating'=>4.6,'cover'=>"🧠",'color'=>"#4a1d96",'description'=>"Dua sistem berpikir manusia: sistem cepat intuitif dan sistem lambat analitis.",'features'=>["non-fiction","psychology","science","philosophy","education","cognitive"]],
            ['title'=>"The Alchemist",'author'=>"Paulo Coelho",'year'=>1988,'rating'=>4.6,'cover'=>"✨",'color'=>"#92400e",'description'=>"Gembala Andalusia mengikuti impiannya dan belajar bahwa harta sejati ada di dalam hati.",'features'=>["inspirational","literary","adventure","philosophy","classic","fable"]],
            ['title'=>"To Kill a Mockingbird",'author'=>"Harper Lee",'year'=>1960,'rating'=>4.8,'cover'=>"🐦",'color'=>"#7f1d1d",'description'=>"Perjuangan Atticus membela pria kulit hitam yang dituduh tidak adil.",'features'=>["literary","classic","social-critique","drama","mystery","historical"]],
            ['title'=>"Pride and Prejudice",'author'=>"Jane Austen",'year'=>1813,'rating'=>4.7,'cover'=>"💌",'color'=>"#881337",'description'=>"Romansa abadi antara Elizabeth Bennet dan Mr. Darcy penuh prasangka dan kebanggaan.",'features'=>["romance","classic","literary","drama","historical","comedy"]],
            ['title'=>"Jane Eyre",'author'=>"Charlotte Bronte",'year'=>1847,'rating'=>4.7,'cover'=>"🕯️",'color'=>"#1c1917",'description'=>"Jane Eyre, yatim piatu yang kuat dan mandiri, menemukan cinta dan identitasnya sendiri.",'features'=>["romance","classic","literary","drama","gothic","historical"]],
            ['title'=>"The Great Gatsby",'author'=>"F. Scott Fitzgerald",'year'=>1925,'rating'=>4.4,'cover'=>"🥂",'color'=>"#0c4a6e",'description'=>"Jay Gatsby yang kaya namun kesepian mengejar impian cinta lamanya di era Jazz Amerika.",'features'=>["literary","classic","drama","romance","social-critique","historical"]],
            ['title'=>"Ikigai",'author'=>"Hector Garcia",'year'=>2016,'rating'=>4.4,'cover'=>"🌸",'color'=>"#be185d",'description'=>"Rahasia hidup panjang dan bahagia dari warga Okinawa.",'features'=>["self-help","non-fiction","philosophy","psychology","practical","inspirational"]],
            ['title'=>"Filosofi Teras",'author'=>"Henry Manampiring",'year'=>2018,'rating'=>4.6,'cover'=>"🏛️",'color'=>"#065f46",'description'=>"Filsafat Stoisisme yang dikemas relevan untuk pembaca Indonesia modern.",'features'=>["indonesia","self-help","philosophy","non-fiction","practical","psychology"]],
            ['title'=>"Negeri 5 Menara",'author'=>"Ahmad Fuadi",'year'=>2009,'rating'=>4.6,'cover'=>"🕌",'color'=>"#1e3a5f",'description'=>"Kisah inspiratif Alif Fikri berjuang meraih mimpi dari pesantren di Jawa Timur.",'features'=>["indonesia","inspirational","school","friendship","drama","childhood","series"]],
            ['title'=>"Perahu Kertas",'author'=>"Dewi Lestari",'year'=>2009,'rating'=>4.4,'cover'=>"🛶",'color'=>"#7f1d1d",'description'=>"Kisah cinta dan persahabatan antara Kugy dan Keenan penuh impian dan seni.",'features'=>["indonesia","romance","drama","friendship","young-adult","literary"]],
            ['title'=>"Rich Dad Poor Dad",'author'=>"Robert Kiyosaki",'year'=>1997,'rating'=>4.4,'cover'=>"💰",'color'=>"#92400e",'description'=>"Perbedaan cara pandang orang kaya dan miskin tentang uang dan investasi.",'features'=>["self-help","non-fiction","finance","practical","education"]],
            ['title'=>"Clean Code",'author'=>"Robert C. Martin",'year'=>2008,'rating'=>4.5,'cover'=>"💻",'color'=>"#0f172a",'description'=>"Panduan menulis kode bersih, mudah dibaca, dan mudah dipelihara.",'features'=>["non-fiction","technology","programming","education","practical"]],
            ['title'=>"The Hitchhiker's Guide to the Galaxy",'author'=>"Douglas Adams",'year'=>1979,'rating'=>4.6,'cover'=>"🌌",'color'=>"#312e81",'description'=>"Arthur Dent selamat dari kehancuran Bumi dan memulai petualangan gila di seluruh galaksi.",'features'=>["sci-fi","comedy","adventure","classic","satire"]],
        ];

        foreach ($books as $b) {
            Book::create($b);
        }
    }
}
