# Radix UI Packages - Documentação Oficial

## ❌ Pacotes que NÃO existem
- `@radix-ui/react-button` - **NÃO EXISTE**

## ✅ Pacotes Oficiais do Radix UI

### Componentes UI Principais
```bash
npm install @radix-ui/react-dialog
npm install @radix-ui/react-dropdown-menu  
npm install @radix-ui/react-select
npm install @radix-ui/react-separator
npm install @radix-ui/react-popover
npm install @radix-ui/react-accordion
npm install @radix-ui/react-checkbox
npm install @radix-ui/react-radio-group
npm install @radix-ui/react-switch
npm install @radix-ui/react-slider
npm install @radix-ui/react-tabs
npm install @radix-ui/react-toast
npm install @radix-ui/react-tooltip
npm install @radix-ui/react-progress
npm install @radix-ui/react-scroll-area
npm install @radix-ui/react-toggle
npm install @radix-ui/react-toggle-group
```

### Utilitários e Hooks
```bash
npm install @radix-ui/react-slot          # Composição de componentes
npm install @radix-ui/react-portal        # Portais React
npm install @radix-ui/react-icons         # Conjunto de ícones
npm install @radix-ui/react-label         # Labels acessíveis
npm install @radix-ui/react-visually-hidden
```

## 📝 Como usar sem Button específico

O Radix UI **não tem um componente Button específico** porque:

1. **Buttons são nativos** - `<button>` HTML já é acessível
2. **Use @radix-ui/react-slot** - Para composição de componentes
3. **Shadcn/UI** - Tem implementação própria usando slot + class-variance-authority

### Exemplo de Button com Slot:
```tsx
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
```

## 🔧 Dependências Corretas para Shadcn/UI

```json
{
  "@radix-ui/react-slot": "^1.0.2",
  "@radix-ui/react-dialog": "^1.0.5", 
  "@radix-ui/react-dropdown-menu": "^2.0.6",
  "@radix-ui/react-label": "^2.0.2",
  "@radix-ui/react-separator": "^1.0.3",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0"
}
```

## ⚠️ Aviso de Segurança

- Sempre use apenas pacotes oficiais do `@radix-ui/*`
- Evite pacotes de terceiros que imitam nomes do Radix UI
- Verifique sempre no npm oficial antes de instalar

## 📚 Links Oficiais

- [Documentação](https://www.radix-ui.com/primitives)
- [GitHub](https://github.com/radix-ui/primitives)
- [NPM Search](https://www.npmjs.com/search?q=%40radix-ui)

---
**Última atualização**: 10/08/2025