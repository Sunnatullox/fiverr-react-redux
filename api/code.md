// const reUploadImageDb = async () => {
//   try {
//     const allGigs = await Gigs.find();
//     const fileList = await fs.promises.readdir("uploads/categorys");

//     for (const gig of allGigs) {
//       // let uploadingFiles = [];
//       const result = fileList.find((item) => "uploads/categorys/"+ item == gig.logo);
//         if (result) {
//           const uploaded = await uploadFileToFirebaseStorage({
//             buffer: await fs.promises.readFile(`uploads/categorys/${result}`),
//             originalname: result,
//           });

//           console.log("uploaded " + uploaded)

//       // for (const value of gig.images) {
//       //   const result = fileList.find((item) => item === value);

//       //   if (result) {
//       //     const uploaded = await uploadFileToFirebaseStorage({
//       //       buffer: await fs.promises.readFile(`uploads/${result}`),
//       //       originalname: result,
//       //     });

//       //     uploadingFiles.push(uploaded);
//       //   }else{
//       //     console.log("rasim topilmadi")
//       //   }
//       // }
//      const updateList = uploaded ? await Gigs.findByIdAndUpdate(gig._id, { $set: { logo: uploaded } }, { new: true }) : null
//       console.log("o'zgartirildi : " + updateList)
//     }}

//     console.log("Barcha rasmlar muvaffaqiyatli yuklandi.");
//   } catch (error) {
//     console.error("Xatolik yuz berdi:", error);
//   }
// }

// // reUploadImageDb();