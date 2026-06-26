# Foto mobil (asli)

Letakkan foto resmi brosur di sini, mengikuti `src` pada `src/data/cars.json`.
Contoh untuk J8 ARDIS:

```
src/assets/cars/j8-ardis/hero.jpg
src/assets/cars/j8-ardis/samping.jpg
src/assets/cars/j8-ardis/interior.jpg
src/assets/cars/j8-ardis/belakang.jpg
```

- Format sumber: JPG/PNG/WebP resolusi tinggi (latar studio bersih). Komponen
  `CarImage.astro` otomatis mengoptimasi ke AVIF/WebP + srcset via Astro `<Picture>`.
- Selama foto belum ada, `CarImage` menampilkan placeholder rapi (tanpa error build).
- Disarankan rasio mendekati 16:10 untuk hero & kartu agar tidak ada pergeseran layout.
