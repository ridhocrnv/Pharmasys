// backend/controllers/transactionController.js
const db = require('../config/db');

exports.createTransaction = async (req, res) => {
    const { id_obat, tipe_transaksi, jumlah } = req.body;
    const id_user = req.user.id; // Diambil dari token JWT

    if (!id_user) return res.status(401).json({ message: "User tidak teridentifikasi" });

    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        // Cek Stok
        const [medicine] = await conn.execute('SELECT stok FROM medicines WHERE id = ?', [id_obat]);
        let stokBaru = medicine[0].stok;

        if (tipe_transaksi === 'Masuk') {
            stokBaru += parseInt(jumlah);
        } else {
            if (stokBaru < jumlah) throw new Error("Stok tidak mencukupi");
            stokBaru -= parseInt(jumlah);
        }

        if (tipe_transaksi === 'Keluar') {
            if (stokBaru < jumlah) {
                return res.status(400).json({
                    message: "Gagal: Stok tidak mencukupi!",
                    current_stok: stokBaru
                });
            }
            stokBaru -= parseInt(jumlah);
        }

        // Update Stok
        await conn.execute('UPDATE medicines SET stok = ? WHERE id = ?', [stokBaru, id_obat]);

        // Simpan Transaksi (PASTIKAN id_user MASUK DISINI)
        await conn.execute(
            'INSERT INTO transactions (id_obat, tipe_transaksi, jumlah, id_user) VALUES (?, ?, ?, ?)',
            [id_obat, tipe_transaksi, jumlah, id_user]
        );

        await conn.commit();
        res.status(201).json({ message: `Transaksi ${tipe_transaksi} berhasil dicatat` });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        conn.release();
    }
};