import $ from '../core/jquery.with.plugins.js';

export function ChangeDirection(dir, align) {
  this.selection.save();
  const elements = this.html.blocks();
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (element !== this.$el.get(0)) {
      $(element)
        .css('direction', dir)
        .css('text-align', align);
    }
  }

  this.selection.restore();
}

const toolbarButtonMode = {
  default: [
    'bold', 'italic', 'underline', 'fontSize', 'color', 'fontFamily', 'subscript', 'superscript', '|',
    'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', '|',
    'insertLink', 'undo', 'redo', 'rightToLeft', 'leftToRight', 'clearFormatting'
  ],
  mc: ['bold', 'italic', 'underline', 'color', '|',
    'outdent', 'indent', '|',
    'undo', 'redo', 'rightToLeft', 'leftToRight'
  ]
};

const defaultConfiguration = {
  toolbarInline: false,
  toolbarSticky: false,
  toolbarButtons: toolbarButtonMode.full,
  theme: 'custom',
  pastePlain: true
};

// returns a json that can initialize a froala editor
export function TextEditModel(args) {
  const config = $.extend(true, {}, defaultConfiguration);
  // overide default toolbar buttons
  if (args.toolbar && toolbarButtonMode[args.toolbar]) {
    config.toolbarButtons = toolbarButtonMode[args.toolbar];
  }

  // override the placeholder text that appears before typing
  config.placeholderText = args.placeholder;

  if (args.direction === 'rtl') {
    config.direction = 'rtl';
  }
  return config;
}
