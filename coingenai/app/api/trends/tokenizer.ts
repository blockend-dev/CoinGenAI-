// tokenizer.ts
export class Tokenizer {
    private vocabulary: { [key: string]: number } = {};
    private maxLength: number = 100;  // Adjust this according to your model's input size
  
    constructor(vocabulary?: { [key: string]: number }) {
      if (vocabulary) {
        this.vocabulary = vocabulary;
      }
    }
  
    // Tokenization: Converts a string into an array of integers
    tokenize(text: string): number[] {
      const words = text.toLowerCase().split(/\s+/);  // Tokenize by whitespace and convert to lowercase
      return words.map(word => this.vocabulary[word] || 0); // Use 0 for unknown words
    }
  
    // Padding: Pads or truncates the tokenized sequence to match the model's input size
    padSequence(sequence: number[]): number[] {
      if (sequence.length < this.maxLength) {
        // Pad with zeros if sequence is shorter than max length
        return [...sequence, ...Array(this.maxLength - sequence.length).fill(0)];
      } else {
        // Truncate the sequence if it's longer than the max length
        return sequence.slice(0, this.maxLength);
      }
    }
  
    // Combine tokenization and padding
    preprocessText(text: string): number[] {
      const tokenizedText = this.tokenize(text);
      return this.padSequence(tokenizedText);
    }
  }
  