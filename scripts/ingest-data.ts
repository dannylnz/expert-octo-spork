import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { pinecone } from '@/utils/pinecone-client';
import { CustomPDFLoader } from '@/utils/customPDFLoader';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';
//import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { S3Loader } from "langchain/document_loaders/web/s3";

// AWS S3 Bucket loader
const loader = new S3Loader({
  bucket: "talkingpdf",
  key: "Eparina_2017_11_29_Web.pdf",
  unstructuredAPIURL: "http://localhost:8000/general/v0/general",
});

/* Name of directory to retrieve your files from */
const filePathFromScript = process.argv[3]
console.log("file path from script: ", filePathFromScript)
const filePath = filePathFromScript;


export const run = async () => {
  try {
    /*load raw docs from the all files in the directory */
    // const directoryLoader = new DirectoryLoader(filePath, {
    //   '.pdf': (path) => new CustomPDFLoader(path),
    // });
    console.log(filePath)
    const textLoader = new CustomPDFLoader(filePath)
     const loader = new PDFLoader(filePath);
    //const docsS3 = await loader.load();
   const rawDocs = await textLoader.load();

    /* Split text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await textSplitter.splitDocuments(rawDocs);
    console.log('split docs', docs);

    console.log('creating vector store...');
    /*create and store the embeddings in the vectorStore*/
    const embeddings = new OpenAIEmbeddings();
    const index = pinecone.Index(PINECONE_INDEX_NAME); //change to your own index name

    //embed the PDF documents
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace: PINECONE_NAME_SPACE,
      textKey: 'text',
    });
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to ingest your data');
  }
};

(async () => {
  await run();
  console.log('ingestion complete');
})();
