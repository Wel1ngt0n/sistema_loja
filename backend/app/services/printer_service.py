from app.models.settings import SystemSetting
from app.models.sale import Sale
from escpos.printer import Network, Dummy

class PrinterService:
    @staticmethod
    def get_printer():
        """
        Retorna uma instância da impressora baseada nas configurações.
        Se não configurada, retorna Dummy.
        """
        ptype = SystemSetting.get_value('PRINTER_TYPE')
        pip = SystemSetting.get_value('PRINTER_IP')
        
        if ptype == 'NETWORK' and pip:
            try:
                return Network(pip)
            except Exception as e:
                print(f"Erro ao conectar na impressora: {e}")
                return Dummy()
        
        return Dummy()

    @staticmethod
    def safe_text(text):
        """Remove caracteres problemáticos para impressoras térmicas"""
        try:
            import unicodedata
            if text is None: return ""
            # Normalize unicode characters to closest ASCII
            normalized = unicodedata.normalize('NFKD', str(text)).encode('ASCII', 'ignore').decode('ASCII')
            return normalized
        except Exception:
            return str(text)

    @staticmethod
    def print_sale(sale_id):
        sale = Sale.query.get(sale_id)
        if not sale:
            raise ValueError("Venda não encontrada")

        p = PrinterService.get_printer()
        
        # Helper pra imprimir sem crashar
        def pt(txt):
            try:
                p.text(PrinterService.safe_text(txt))
            except Exception as e:
                print(f"Erro de encoding na impressora: {e}")

        try:
            # Header
            p.set(align='center')
            pt("SISTEMA PDV\n")
            pt("Rua Exemplo, 123\n")
            pt(f"CNPJ: 00.000.000/0000-00\n")
            pt("--------------------------------\n")
            pt(f"VENDA #{sale.id}\n")
            pt(f"DATA: {sale.created_at.strftime('%d/%m/%Y %H:%M')}\n")
            pt("--------------------------------\n")
            
            # Items
            p.set(align='left')
            for item in sale.items:
                # Format: Qtd x Item ..... Total
                name = item.product_name[:20]
                line = f"{item.qty}x {name:<20} {item.total_price:.2f}\n"
                pt(line)
                
            pt("--------------------------------\n")
            
            # Totals
            p.set(align='right')
            pt(f"SUBTOTAL: R$ {sale.subtotal_value:.2f}\n")
            
            if sale.discount_value > 0:
                 pt(f"DESCONTO: R$ {sale.discount_value:.2f}\n")
            
            pt(f"TOTAL: R$ {sale.total_value:.2f}\n")
            
            pt("--------------------------------\n")
            p.set(align='center')
            pt("Obrigado pela preferencia!\n")
            
            p.cut()

            # --- SAVE TO FILE (User Request) ---
            try:
                import os
                from datetime import datetime
                
                # Define receipts directoy relative to app root
                receipts_dir = "/app/receipts" 
                if not os.path.exists(receipts_dir):
                    os.makedirs(receipts_dir)
                
                filename = f"recibo_venda_{sale.id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
                filepath = os.path.join(receipts_dir, filename)
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    # Re-generate text for file (since printer object consumes it)
                    # We can refactor above to build a list of lines, but for now copying logic is safer/faster
                    def fpt(txt): f.write(PrinterService.safe_text(txt))
                    
                    fpt(f"{'SISTEMA PDV':^32}\n")
                    fpt(f"{'Rua Exemplo, 123':^32}\n")
                    fpt(f"{'CNPJ: 00.000.000/0000-00':^32}\n")
                    fpt("-" * 32 + "\n")
                    fpt(f"VENDA #{sale.id}\n")
                    fpt(f"DATA: {sale.created_at.strftime('%d/%m/%Y %H:%M')}\n")
                    fpt("-" * 32 + "\n")
                    
                    for item in sale.items:
                        name = item.product_name[:20]
                        fpt(f"{item.qty}x {name:<20} {item.total_price:.2f}\n")
                        
                    fpt("-" * 32 + "\n")
                    fpt(f"{f'SUBTOTAL: R$ {sale.subtotal_value:.2f}':>32}\n")
                    if sale.discount_value > 0:
                        fpt(f"{f'DESCONTO: R$ {sale.discount_value:.2f}':>32}\n")
                    fpt(f"{f'TOTAL: R$ {sale.total_value:.2f}':>32}\n")
                    fpt("-" * 32 + "\n")
                    fpt(f"{'Obrigado pela preferencia!':^32}\n")

            except Exception as e:
                print(f"Erro ao salvar arquivo de impressao: {e}")
                import traceback
                traceback.print_exc()
            # -----------------------------------

        except Exception as e:
            print(f"Erro crítico na impressão: {e}")
            # Se for Dummy, ignora erros de 'impl'
            if not isinstance(p, Dummy):
                raise e
        
        # If dummy, we can return the output bytes if needed
        if isinstance(p, Dummy):
            return p.output
            
        return True
