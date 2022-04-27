import * as path from "path";
import * as fs from 'fs';

class WorkingDirectory {
  public path: string;

  constructor() {
    this.path = path.join(__dirname, '..', '..', 'packadvice');
    fs.mkdirSync(this.path, { recursive: true });
  }

  get artifact(): string {
    return path.join(this.path, 'artifact.zip');
  }

  get packadvice(): string {
    return path.join(this.path, 'packadvice');
  }

  get output(): string {
    return path.join(this.path, 'output.md');
  }
}

export default WorkingDirectory;
