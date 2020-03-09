// import React from 'react'
// import gql from 'graphql-tag'
// import { graphql } from 'react-apollo'


// const uploadsQuery = gql`
//   query uploads {
//     uploads {
//       id
//       filename
//       mimetype
//       path
//     }
//   }
// `

// const UploadFile = ({ mutate }) => {
//   const handleChange = ({
//     target,
//   }) => {
//     const {
//       validity,
//       files: [file],
//     } = target
//     validity.valid && mutate({
//       variables: { file },
//     })
//   }

//   return <input type="file" required onChange={handleChange} />
// }


// export default graphql(gql`
//   mutation($file: Upload!) {
//     uploadProfileImage(file: $file)
//   }
// `)(UploadFile)
